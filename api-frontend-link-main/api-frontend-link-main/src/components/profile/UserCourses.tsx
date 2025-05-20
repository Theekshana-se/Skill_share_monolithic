import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { Course, courseService } from '@/api/courseService';
import { toast } from '@/components/ui/use-toast';

interface UserCoursesProps {
  courses: Course[];
  isOwnProfile: boolean;
  onDeleteCourse: (courseId: string) => void;
}

const UserCourses = ({ courses, isOwnProfile, onDeleteCourse }: UserCoursesProps) => {
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId);
      onDeleteCourse(courseId);
      toast({
        title: "Course deleted",
        description: "Your course has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course. Please try again."
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>My Courses</CardTitle>
        {isOwnProfile && (
          <Link to="/create-course">
            <Button size="sm" className="ml-auto">Add Course</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course) => (
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
                        {isOwnProfile && (
                          <>
                            <Link to={`/courses/${course.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteCourse(course.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCourses;
