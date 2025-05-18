
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  courseName: string;
  courseLevel: string;
  institute: string;
  startDate?: string;
  duration: number;
  courseType: string;
  progress: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      // Mock data for now - would normally use courseService.getAllCourses()
      setTimeout(() => {
        const mockCourses = [
          {
            id: '1',
            courseName: 'Web Development Fundamentals',
            courseLevel: 'Beginner',
            institute: 'Tech Academy',
            startDate: '2023-06-01',
            duration: 8,
            courseType: 'Online',
            progress: 75
          },
          {
            id: '2',
            courseName: 'Advanced JavaScript',
            courseLevel: 'Intermediate',
            institute: 'Code Masters',
            startDate: '2023-07-15',
            duration: 6,
            courseType: 'Online',
            progress: 50
          },
          {
            id: '3',
            courseName: 'UX/UI Design Principles',
            courseLevel: 'Beginner',
            institute: 'Design School',
            startDate: '2023-08-01',
            duration: 4,
            courseType: 'Hybrid',
            progress: 25
          }
        ];
        setCourses(mockCourses);
        setIsLoading(false);
      }, 1000);
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
              <Button className="whitespace-nowrap">
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
            <Card key={course.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <BookOpen />
                </div>
                <CardTitle className="text-xl mb-2">{course.courseName}</CardTitle>
                <CardDescription className="mb-4">
                  {course.institute} • {course.courseLevel}
                </CardDescription>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Duration: {course.duration} weeks</span>
                  <span>{course.courseType}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-medium">
                    Progress: {course.progress}%
                  </span>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or create a new course</p>
          {isAuthenticated && (
            <Link to="/create-course" className="mt-6 inline-block">
              <Button>Create Course</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
