import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Course, courseService } from '@/api/courseService';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [aiFilteredCourses, setAiFilteredCourses] = useState<Course[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Replace with your Cohere API key
  const COHERE_API_KEY = 'W05YXQueqqP2AwrLAWhad2PIMnjKwpWLvPedWHVk';

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const allCourses = await courseService.getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      setAiFilteredCourses(null);
      return;
    }
    setAiLoading(true);
    try {
      // Get embedding for the prompt (as search_query)
      const promptEmbedding = await getEmbedding(aiSearchTerm, "search_query");
      // Get embeddings for each course (as search_document)
      const courseEmbeddings = await Promise.all(
        courses.map(async (course) => {
          const text = `${course.courseName} ${course.institute} ${course.courseLevel} ${course.courseType} ${course.description || ''}`;
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
      setAiFilteredCourses(filtered);
    } catch (error) {
      console.error('AI search error:', error);
      setAiFilteredCourses([]);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.institute.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* AI Search Bar */}
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
          {aiFilteredCourses && (
            <Button variant="outline" onClick={() => { setAiFilteredCourses(null); setAiSearchTerm(''); }}>
              Clear
            </Button>
          )}
        </div>
        {aiFilteredCourses && (
          <div className="text-sm text-gray-500 mt-2">Showing results for: <span className="font-medium">{aiSearchTerm}</span></div>
        )}
      </div>
      {/* Existing search bar and create button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Browse Courses</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {isAuthenticated && (
            <Link to="/create-course">
              <Button className="whitespace-nowrap bg-purple-600 text-white hover:bg-purple-700">
                <Plus className="mr-2 h-5 w-5" />
                Create Course
              </Button>
            </Link>
          )}
        </div>
      </div>
      {/* Course grid */}
      {isLoading || aiLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-2/3 mb-3" />
                <Skeleton className="h-4 mb-2" />
                <Skeleton className="h-4 w-4/5 mb-6" />
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-2 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (aiFilteredCourses ? (
        aiFilteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiFilteredCourses.map((course) => (
              <Card key={course.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                <div className="relative h-48 w-full">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-purple-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{course.courseName}</CardTitle>
                  <CardDescription className="mb-4 text-gray-600">
                    {course.institute} • {course.courseLevel}
                  </CardDescription>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Duration: {course.duration} weeks</span>
                    <span>{course.courseType}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Progress: {course.progress}%
                  </span>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No courses found for your prompt</h3>
            <p className="text-gray-500 mt-2">Try a different prompt or clear the AI search</p>
            <Button variant="outline" onClick={() => { setAiFilteredCourses(null); setAiSearchTerm(''); }} className="mt-4">Clear AI Search</Button>
          </div>
        )
      ) : filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              <div className="relative h-48 w-full">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-purple-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{course.courseName}</CardTitle>
                <CardDescription className="mb-4 text-gray-600">
                  {course.institute} • {course.courseLevel}
                </CardDescription>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Duration: {course.duration} weeks</span>
                  <span>{course.courseType}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Progress: {course.progress}%
                </span>
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" size="sm" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or create a new course</p>
          {isAuthenticated && (
            <Link to="/create-course" className="mt-6 inline-block">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">Create Course</Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Courses;