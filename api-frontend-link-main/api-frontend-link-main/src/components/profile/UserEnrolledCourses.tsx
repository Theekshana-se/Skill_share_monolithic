import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, X, RefreshCw } from 'lucide-react';
import { enrollmentService, Enrollment } from '@/api/enrollmentService';
import { courseService, Course } from '@/api/courseService';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type EnrolledCourse = Course & {
  enrollmentId: string;
  progress: number;
};

const UserEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[DEBUG] Fetching enrolled courses...');
      const enrollments = await enrollmentService.getUserEnrollments();
      console.log('[DEBUG] Received enrollments:', enrollments);

      const courseDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const course = await courseService.getCourseById(enrollment.courseId);
            if (!course) {
              console.error(`[DEBUG] Course not found for ID: ${enrollment.courseId}`);
              return null;
            }
            const enrolledCourse: EnrolledCourse = {
              ...course,
              enrollmentId: enrollment.id,
              progress: enrollment.progress
            };
            return enrolledCourse;
          } catch (error) {
            console.error(`[DEBUG] Error fetching course ${enrollment.courseId}:`, error);
            return null;
          }
        })
      );

      const validCourses = courseDetails.filter((course): course is EnrolledCourse => course !== null);
      console.log('[DEBUG] Valid courses after filtering:', validCourses);
      setEnrolledCourses(validCourses);
    } catch (error) {
      console.error('[DEBUG] Error fetching enrolled courses:', error);
      setError(error instanceof Error ? error.message : "Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId: string) => {
    try {
      setRefreshing(true);
      console.log('[DEBUG] Starting unenroll process for course:', courseId);
      await enrollmentService.unenrollFromCourse(courseId);
      console.log('[DEBUG] Successfully unenrolled from course:', courseId);
      toast({
        title: "Success",
        description: "Successfully unenrolled from course",
      });
      // Refresh the enrolled courses list
      await fetchEnrolledCourses();
    } catch (error) {
      console.error('[DEBUG] Error unenrolling from course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unenroll from course",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEnrolledCourses();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-32 h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enrolled Courses</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {enrolledCourses.length > 0 ? (
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <Card key={course.enrollmentId} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{course.courseName}</h3>
                          <p className="text-sm text-gray-500">{course.institute} • {course.courseLevel} • {course.courseType}</p>
                        </div>
                        <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {course.progress}% complete
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm">View Course</Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to unenroll from this course?")) {
                              handleUnenroll(course.id!);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Unenroll
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No enrolled courses yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserEnrolledCourses; 