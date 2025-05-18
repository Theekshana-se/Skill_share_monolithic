
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Calendar, Clock, User, School } from 'lucide-react';
import { Course, courseService } from '@/api/courseService';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // In a real app, we'd fetch from the API
        // const courseData = await courseService.getCourseById(id);
        
        // Using mock data for now
        setTimeout(() => {
          const mockCourse = {
            id: '2',
            courseName: 'Advanced JavaScript',
            courseLevel: 'Intermediate',
            institute: 'Code Masters',
            startDate: '2023-07-15',
            duration: 6,
            courseType: 'Online',
            progress: 50
          };
          setCourse(mockCourse);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load course details"
        });
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const enrollInCourse = async () => {
    if (!course) return;
    
    try {
      // In a real implementation, you'd call the API
      // await enrollService.createEnrollment({ courseId: course.id });
      
      toast({
        title: "Success",
        description: "You have successfully enrolled in this course"
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enroll in course"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses">
          <Button>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/courses" className="inline-flex items-center text-purple-600 mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Courses
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
          <p className="text-gray-500">Offered by {course.institute}</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Learn everything about {course.courseName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium">{course.courseLevel}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{course.duration} weeks</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{course.startDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <School className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course Type</p>
                  <p className="font-medium">{course.courseType}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Progress</p>
              <div className="flex items-center">
                <Progress value={course.progress} className="h-2 flex-1 mr-4" />
                <span className="text-sm font-medium">{course.progress}%</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              {isAuthenticated ? (
                <Button onClick={enrollInCourse} className="w-full md:w-auto">
                  Enroll in this Course
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="w-full md:w-auto">
                    Log in to Enroll
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetail;
