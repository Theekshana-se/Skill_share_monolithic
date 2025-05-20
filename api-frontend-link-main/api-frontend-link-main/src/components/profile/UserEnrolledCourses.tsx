import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { enrollmentService, Enrollment } from '@/api/enrollmentService';
import { courseService, Course } from '@/api/courseService';
import { Progress } from '@/components/ui/progress';

interface EnrolledCourse {
  course: Course;
  progress: number;
}

const UserEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      const enrollments: Enrollment[] = await enrollmentService.getUserEnrollments();
      const courseDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await courseService.getCourseById(enrollment.courseId);
          return course ? { course, progress: enrollment.progress } : null;
        })
      );
      setEnrolledCourses(courseDetails.filter(Boolean) as EnrolledCourse[]);
      setLoading(false);
    };
    fetchEnrolledCourses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length > 0 ? (
          <div className="space-y-4">
            {enrolledCourses.map(({ course, progress }) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                          {progress}% complete
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm">View Course</Button>
                        </Link>
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