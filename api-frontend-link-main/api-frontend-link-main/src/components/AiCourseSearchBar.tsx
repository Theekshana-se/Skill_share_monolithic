import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Course } from '@/api/courseService';

interface AiCourseSearchBarProps {
  courses: Course[];
  onResults: (filtered: Course[] | null) => void;
  cohereApiKey?: string;
}

const DEFAULT_COHERE_API_KEY = 'W05YXQueqqP2AwrLAWhad2PIMnjKwpWLvPedWHVk';

const AiCourseSearchBar: React.FC<AiCourseSearchBarProps> = ({ courses, onResults, cohereApiKey }) => {
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const COHERE_API_KEY = cohereApiKey || DEFAULT_COHERE_API_KEY;

  // Helper: Get embedding from Cohere
  const getEmbedding = async (text: string, inputType: "search_query" | "search_document"): Promise<number[]> => {
    if (!text.trim()) throw new Error("Cannot embed empty text");
    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/embed',
        {
          texts: [text],
          model: 'embed-english-v3.0',
          input_type: inputType,
        },
        {
          headers: {
            'Authorization': `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.data.embeddings || !response.data.embeddings[0]) {
        throw new Error("No embedding returned from Cohere");
      }
      return response.data.embeddings[0];
    } catch (error: any) {
      if (error.response) {
        console.error("Cohere API error:", error.response.data);
      }
      throw error;
    }
  };

  // Helper: Cosine similarity
  const cosineSimilarity = (a: number[], b: number[]) => {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
  };

  // AI Search handler
  const handleAiSearch = async () => {
    if (!aiSearchTerm.trim()) {
      onResults(null);
      return;
    }
    setAiLoading(true);
    try {
      // Get embedding for the prompt (as search_query)
      const promptEmbedding = await getEmbedding(aiSearchTerm, "search_query");
      // Get embeddings for each course (as search_document)
      const courseEmbeddings = await Promise.all(
        courses.map(async (course) => {
          const text = `${course.courseName} ${course.institute} ${course.courseLevel} ${course.courseType}`;
          const embedding = await getEmbedding(text, "search_document");
          return { course, embedding };
        })
      );
      // Compute similarity
      const scored = courseEmbeddings.map(({ course, embedding }) => ({
        course,
        score: cosineSimilarity(promptEmbedding, embedding),
      }));
      // Sort by similarity and take top 5
      const filtered = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ course }) => course);
      onResults(filtered);
    } catch (error) {
      console.error('AI search error:', error);
      onResults([]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2 text-purple-700">AI Powered Search</label>
      <div className="flex gap-2">
        <Input
          placeholder="Type a prompt, e.g. 'find me courses related to react'..."
          value={aiSearchTerm}
          onChange={e => setAiSearchTerm(e.target.value)}
          className="flex-1"
          disabled={aiLoading}
        />
        <Button onClick={handleAiSearch} disabled={aiLoading || !aiSearchTerm.trim()} className="bg-purple-600 text-white hover:bg-purple-700">
          {aiLoading ? 'Searching...' : 'AI Search'}
        </Button>
        <Button variant="outline" onClick={() => { onResults(null); setAiSearchTerm(''); }}>
          Clear
        </Button>
      </div>
      {/* Optionally show the current prompt */}
      {/* {aiFilteredCourses && (
        <div className="text-sm text-gray-500 mt-2">Showing results for: <span className="font-medium">{aiSearchTerm}</span></div>
      )} */}
    </div>
  );
};

export default AiCourseSearchBar; 