
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Course, courseService } from '@/api/courseService';

const formSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  courseLevel: z.string().min(1, 'Course level is required'),
  institute: z.string().min(1, 'Institute name is required'),
  startDate: z.string().optional(),
  duration: z.coerce.number().min(1, 'Duration must be at least 1'),
  courseType: z.string().min(1, 'Course type is required'),
  progress: z.coerce.number().min(0, 'Progress cannot be negative').max(100, 'Progress cannot exceed 100%'),
});

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: '',
      courseLevel: '',
      institute: '',
      startDate: '',
      duration: undefined,
      courseType: '',
      progress: 0,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please log in to edit courses",
      });
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const course = await courseService.getCourseById(id!);
        
        // Check if current user is the owner
        if (course.userId && course.userId !== currentUser?.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You can only edit your own courses",
          });
          navigate('/courses');
          return;
        }
        
        form.reset({
          courseName: course.courseName,
          courseLevel: course.courseLevel,
          institute: course.institute,
          startDate: course.startDate || '',
          duration: course.duration,
          courseType: course.courseType,
          progress: course.progress,
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load course data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, isAuthenticated, currentUser, navigate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Fix: Ensure all required properties are included and not optional
      const courseData: Course = {
        courseName: values.courseName,
        courseLevel: values.courseLevel,
        institute: values.institute,
        startDate: values.startDate,
        duration: values.duration,
        courseType: values.courseType,
        progress: values.progress,
        userId: currentUser?.id,
      };
      
      await courseService.updateCourse(id!, courseData);
      
      toast({
        title: "Course Updated",
        description: "Your course has been successfully updated",
      });
      
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update course. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p>Loading course data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Course</CardTitle>
            <CardDescription>
              Make changes to your course details and save them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Course name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="institute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute</FormLabel>
                        <FormControl>
                          <Input placeholder="Institute name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (weeks)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="In-person">In-person</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <CardFooter className="px-0 pt-6">
                  <div className="flex justify-end gap-4 w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(`/courses/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Course</Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCourse;