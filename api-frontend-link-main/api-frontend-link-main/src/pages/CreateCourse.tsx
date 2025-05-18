import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Course, courseService } from '@/api/courseService';
import { useAuth } from '@/contexts/AuthContext';

const lessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  content: z.string().min(10, 'Lesson content must be at least 10 characters'),
});

const moduleSchema = z.object({
  title: z.string().min(3, 'Module title must be at least 3 characters'),
  description: z.string().min(10, 'Module description must be at least 10 characters'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required per module'),
});

const formSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters'),
  courseLevel: z.string().min(1, 'Please select a course level'),
  institute: z.string().min(2, 'Institute name must be at least 2 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 week'),
  courseType: z.string().min(1, 'Please select a course type'),
  modules: z.array(moduleSchema).min(1, 'At least one module is required'),
});

const CreateCourse = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: '',
      courseLevel: '',
      institute: '',
      startDate: '',
      duration: 1,
      courseType: '',
      modules: [{ title: '', description: '', lessons: [{ title: '', content: '' }] }],
    },
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to create a course',
      });
      navigate('/login');
      return;
    }

    try {
      const courseData: Course = {
        courseName: values.courseName,
        courseLevel: values.courseLevel,
        institute: values.institute,
        startDate: values.startDate,
        duration: values.duration,
        courseType: values.courseType,
        progress: 0,
        modules: values.modules.map((module, mIndex) => ({
          id: `mod-${mIndex + 1}`,
          title: module.title,
          description: module.description,
          lessons: module.lessons.map((lesson, lIndex) => ({
            id: `les-${mIndex + 1}-${lIndex + 1}`,
            title: lesson.title,
            content: lesson.content,
          })),
        })),
      };

      await courseService.createCourse(courseData);

      toast({
        title: 'Course Created',
        description: 'Your course has been successfully created',
      });

      navigate('/courses');
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create course. Please try again.',
      });
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to create a course',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your course, including modules and lessons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Course Fields */}
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute/Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tech Academy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="In-Person">In-Person</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
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
                        <FormLabel>Start Date</FormLabel>
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
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Modules */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Modules</h2>
                  {moduleFields.map((module, moduleIndex) => {
                    const { fields: lessonFields, append: appendLesson, remove: removeLesson } = useFieldArray({
                      control: form.control,
                      name: `modules.${moduleIndex}.lessons`,
                    });

                    return (
                      <Card key={module.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Module {moduleIndex + 1}</h3>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeModule(moduleIndex)}
                            disabled={moduleFields.length === 1}
                          >
                            Remove Module
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Module Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Introduction to Programming" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.description`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Module Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe the module content" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-4">
                          <h4 className="text-md font-semibold mb-2">Lessons</h4>
                          {lessonFields.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="ml-4 border-l-2 pl-4 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium">Lesson {lessonIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeLesson(lessonIndex)}
                                  disabled={lessonFields.length === 1}
                                >
                                  Remove Lesson
                                </Button>
                              </div>
                              <FormField
                                control={form.control}
                                name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lesson Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Variables and Data Types" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
                                render={({ field }) => (
                                  <FormItem className="mt-2">
                                    <FormLabel>Lesson Content</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Enter lesson content" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => appendLesson({ title: '', content: '' })}
                          >
                            Add Lesson
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendModule({ title: '', description: '', lessons: [{ title: '', content: '' }] })}
                  >
                    Add Module
                  </Button>
                </div>

                <CardFooter className="px-0 pt-6">
                  <div className="flex justify-end gap-4 w-full">
                    <Button type="button" variant="outline" onClick={() => navigate('/courses')}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Course</Button>
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

export default CreateCourse;