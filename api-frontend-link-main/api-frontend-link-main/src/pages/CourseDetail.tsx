import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Calendar, Clock, School, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Course, courseService } from '@/api/courseService';
import { Enrollment, enrollmentService } from '@/api/enrollmentService';
import { toast, useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({});

  const fetchCourseAndEnrollment = async () => {
    if (!id) return;

      try {
      setLoading(true);
      setError(null);

      // Fetch course data
        const courseData = await courseService.getCourseById(id);
      if (!courseData) {
        throw new Error('Course not found');
      }
        setCourse(courseData);

      // Check enrollment status
      const enrolled = await enrollmentService.isUserEnrolled(id);
      setIsEnrolled(enrolled);

      // If enrolled, fetch enrollment details
      if (enrolled) {
        const enrollments = await enrollmentService.getUserEnrollments();
        const userEnrollment = enrollments.find(e => e.courseId === id);
        if (userEnrollment) {
          setEnrollment(userEnrollment);
        }
      }
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
      setLoading(false);
      }
    };

  useEffect(() => {
    fetchCourseAndEnrollment();
  }, [id]);

  const enrollInCourse = async () => {
    if (!id) return;
    try {
      const newEnrollment = await enrollmentService.enrollInCourse(id);
      setEnrollment(newEnrollment);
      setIsEnrolled(true);
      toast.toast({
        title: 'Success',
        description: 'Successfully enrolled in course',
      });
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast.toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to enroll in course',
      });
    }
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!id || !isEnrolled) return;

    try {
      const updatedEnrollment = await enrollmentService.toggleLessonCompletion(id, lessonId);
      setEnrollment(updatedEnrollment);
      toast.toast({
        title: 'Success',
        description: 'Lesson completion status updated',
      });
    } catch (err) {
      console.error('Error toggling lesson completion:', err);
      toast.toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update lesson completion',
      });
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return enrollment?.completedLessonIds.includes(lessonId) ?? false;
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) {
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
            <div className="relative h-64 w-full mb-6">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-purple-400" />
                </div>
              )}
            </div>
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
                  <p className="font-medium">{course.startDate || 'Not specified'}</p>
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
                <Progress value={enrollment?.progress || 0} className="h-2 flex-1 mr-4" />
                <span className="text-sm font-medium">{enrollment?.progress || 0}%</span>
              </div>
            </div>
            
            {/* Course Content Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              <div className="space-y-4">
                {course.modules?.map((module, index) => (
                  <Collapsible
                    key={module.id || index}
                    open={openModules[module.id || index.toString()]}
                    onOpenChange={() => toggleModule(module.id || index.toString())}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-medium text-gray-900">Module {index + 1}: {module.title}</h4>
                            <span className="text-sm text-gray-500">
                              ({module.lessons?.length || 0} {module.lessons?.length === 1 ? 'lesson' : 'lessons'})
                            </span>
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-gray-400">
                        {openModules[module.id || index.toString()] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t px-4 py-3 bg-gray-50">
                        <div className="space-y-3">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id || lessonIndex}
                              className="bg-white p-3 rounded-md shadow-sm hover:shadow transition-shadow"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-sm font-medium">
                                  {lessonIndex + 1}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-gray-900">Lesson {lessonIndex + 1}: {lesson.title}</h5>
                                    {isEnrolled && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleLessonCompletion(lesson.id!)}
                                        className={`${
                                          isLessonCompleted(lesson.id!) 
                                            ? 'text-green-600 hover:text-green-700' 
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                      >
                                        <CheckCircle2 className="h-5 w-5" />
                                      </Button>
                                    )}
                                  </div>
                                  {lesson.content && (
                                    <p className="text-sm text-gray-500 mt-1">{lesson.content}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!module.lessons || module.lessons.length === 0) && (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-500">No lessons available in this module</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
                {(!course.modules || course.modules.length === 0) && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-gray-500">No modules available for this course.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              {isAuthenticated ? (
                isEnrolled ? (
                  <Button disabled className="w-full md:w-auto">
                    Enrolled
                  </Button>
                ) : (
                  <Button onClick={enrollInCourse} disabled={isEnrolled} className="w-full md:w-auto">
                  Enroll in this Course
                </Button>
                )
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
