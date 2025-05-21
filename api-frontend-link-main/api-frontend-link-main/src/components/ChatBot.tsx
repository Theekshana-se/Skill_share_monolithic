import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  


  // HuggingFace API configuration
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
  const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  console.log("HuggingFace API Key:", API_KEY);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Draggable Button Logic ---
  const handleButtonDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = chatRef.current?.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - (rect ? rect.left : position.x),
      y: e.clientY - (rect ? rect.top : position.y)
    });
  };

  const handleButtonDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleButtonDragEnd = () => {
    setIsDragging(false);
  };

  // --- Existing chat window drag logic (when open) ---
  const handleDragStart = (e: React.MouseEvent) => {
    if (!isOpen) return;
    setIsDragging(true);
    const rect = chatRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('[DEBUG] Sending request to HuggingFace API...');
      const response = await axios.post(
        API_URL,
        { 
          inputs: input,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('[DEBUG] API Response:', response.data);

      // Handle different response formats
      let assistantResponse = '';
      if (Array.isArray(response.data)) {
        // Handle array response format
        assistantResponse = response.data[0]?.generated_text || '';
      } else if (typeof response.data === 'object') {
        // Handle object response format
        assistantResponse = response.data.generated_text || '';
      } else if (typeof response.data === 'string') {
        // Handle string response format
        assistantResponse = response.data;
      }

      if (!assistantResponse) {
        throw new Error('No response generated from the model');
      }

      // Clean up the response
      assistantResponse = assistantResponse
        .replace(input, '') // Remove the input text from the response
        .trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('[DEBUG] Error calling AI API:', error);
      let errorMessage = "I'm sorry, I encountered an error. Please try again later.";
      
      if (axios.isAxiosError(error)) {
        console.log('[DEBUG] Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          url: API_URL
        });

        if (error.response?.status === 401) {
          errorMessage = "Authentication error. Please check the API key.";
        } else if (error.response?.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a few moments.";
        } else if (error.response?.status === 404) {
          errorMessage = "The AI model is currently loading. Please try again in a few moments.";
        } else if (error.response?.status === 503) {
          errorMessage = "The model is currently loading. Please try again in a few moments.";
        } else if (error.response?.data?.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please try again.";
        }
      }

      const errorResponse: Message = {
        role: 'assistant',
        content: errorMessage
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        transition: isDragging ? 'none' : 'box-shadow 0.2s, left 0.2s, top 0.2s',
      }}
      onMouseMove={!isOpen ? handleButtonDrag : undefined}
      onMouseUp={!isOpen ? handleButtonDragEnd : undefined}
      onMouseLeave={!isOpen ? handleButtonDragEnd : undefined}
    >
      {!isOpen ? (
        <Button
          ref={chatRef}
          onClick={() => setIsOpen(true)}
          onMouseDown={handleButtonDragStart}
          className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center hover:scale-105 transition-all border-4 border-white"
          style={{ boxShadow: isDragging ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' : undefined }}
        >
          <MessageSquare className="h-8 w-8 text-white" />
        </Button>
      ) : (
        <Card
          ref={chatRef}
          className={`w-96 shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-purple-50 to-indigo-100 border-0 ${
            isMinimized ? 'h-16' : 'h-[600px]'
          } animate-fade-in`}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <CardHeader
            className="cursor-move bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-xl shadow-md"
            onMouseDown={handleDragStart}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold tracking-wide">Mixtral AI Assistant</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-5 w-5" />
                  ) : (
                    <Minimize2 className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {!isMinimized && (
            <CardContent className="p-0">
              <ScrollArea ref={scrollRef} className="h-[480px] p-4 bg-white/80 rounded-b-xl">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      } animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 text-base font-medium whitespace-pre-line ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white self-end'
                            : 'bg-gradient-to-br from-gray-100 to-purple-100 text-gray-800 self-start'
                        }`}
                        style={{
                          animationDelay: `${index * 60}ms`,
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-gradient-to-br from-gray-200 to-purple-200 rounded-2xl px-4 py-3 shadow-md">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white/90 rounded-b-xl">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  />
                  <Button type="submit" size="icon" disabled={isLoading} className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition-all">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default ChatBot; 