import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Course, courseService } from '@/api/courseService';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

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

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.institute.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
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

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4">
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
      ) : filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4 shadow-md">
                  <BookOpen className="h-8 w-8" />
                </div>
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
      )}
    </div>
  );
};

export default Courses;