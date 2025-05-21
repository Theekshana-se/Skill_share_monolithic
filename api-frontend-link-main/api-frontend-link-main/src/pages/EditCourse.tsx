import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ImagePlus, X } from 'lucide-react';

const formSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  courseLevel: z.string().min(1, 'Course level is required'),
  institute: z.string().min(1, 'Institute name is required'),
  startDate: z.string().optional(),
  duration: z.coerce.number().min(1, 'Duration must be at least 1'),
  courseType: z.string().min(1, 'Course type is required'),
  progress: z.coerce.number().min(0, 'Progress cannot be negative').max(100, 'Progress cannot exceed 100%'),
  thumbnail: z.string().optional(),
  modules: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, 'Module title is required'),
        description: z.string().optional(),
        lessons: z.array(
          z.object({
            id: z.string().optional(),
            title: z.string().min(1, 'Lesson title is required'),
            content: z.string().optional(),
          })
        ).min(0), // Allow empty lessons array
      })
    )
    .optional(),
});

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      thumbnail: '',
      modules: [],
    },
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  // Create a single useFieldArray for all lessons
  const { fields: lessonFields, append: appendLesson, remove: removeLesson } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (1MB limit)
      if (file.size > 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Image size must be less than 1MB',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please upload an image file',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue('thumbnail', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    form.setValue('thumbnail', '');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'Please log in to edit courses',
      });
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const course = await courseService.getCourseById(id!);

        if (course.userId && course.userId !== currentUser?.email) {
          toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'You can only edit your own courses',
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
          thumbnail: course.thumbnail || '',
          modules: course.modules || [],
        });

        if (course.thumbnail) {
          setPreviewImage(course.thumbnail);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load course data',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, isAuthenticated, currentUser, navigate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const courseData: Course = {
        id: id,
        courseName: values.courseName,
        courseLevel: values.courseLevel,
        institute: values.institute,
        startDate: values.startDate,
        duration: values.duration,
        courseType: values.courseType,
        progress: values.progress,
        userId: currentUser?.email,
        thumbnail: values.thumbnail,
        modules: (values.modules || [])
          .filter((m) => m.title && m.title.trim() !== '')
          .map((m) => ({
            id: m.id,
            title: m.title!, // Non-null assertion since we filtered above
            description: m.description,
            lessons: (m.lessons || []).map((l) => ({
              id: l.id,
              title: l.title!, // Non-null assertion
              content: l.content,
            })),
          })),
      };

      await courseService.updateCourse(id!, courseData);

      toast({
        title: 'Course Updated',
        description: 'Your course has been successfully updated',
      });

      navigate(`/profile/${currentUser?.id}?tab=courses`);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update course. Please try again.',
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

  const handleAddLesson = (moduleIndex: number) => {
    const currentModules = form.getValues('modules');
    const updatedModules = [...currentModules];
    if (!updatedModules[moduleIndex].lessons) {
      updatedModules[moduleIndex].lessons = [];
    }
    updatedModules[moduleIndex].lessons.push({ id: '', title: '', content: '' });
    form.setValue('modules', updatedModules);
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentModules = form.getValues('modules');
    const updatedModules = [...currentModules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    form.setValue('modules', updatedModules);
  };

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
                {/* Thumbnail Upload Section */}
                <div className="space-y-4">
                  <FormLabel className="text-gray-700">Course Thumbnail</FormLabel>
                  <div className="flex flex-col items-center justify-center w-full">
                    {previewImage ? (
                      <div className="relative w-full max-w-md">
                        <img
                          src={previewImage}
                          alt="Course thumbnail preview"
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

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

                {/* Modules Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Modules</h3>
                  {moduleFields.map((module, moduleIndex) => (
                    <div key={module.id} className="border p-4 rounded-md space-y-4">
                      <FormField
                        control={form.control}
                        name={`modules.${moduleIndex}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Module title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`modules.${moduleIndex}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Module description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Lessons Section */}
                      <h4 className="text-md font-medium">Lessons</h4>
                      {form.getValues(`modules.${moduleIndex}.lessons`)?.map((lesson, lessonIndex) => (
                        <div key={`${moduleIndex}-${lessonIndex}`} className="ml-4 border-l pl-4 py-2">
                          <FormField
                            control={form.control}
                            name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lesson Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Lesson title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lesson Content (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Lesson content" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                            className="mt-2"
                          >
                            Remove Lesson
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddLesson(moduleIndex)}
                      >
                        Add Lesson
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeModule(moduleIndex)}
                        className="mt-2"
                      >
                        Remove Module
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendModule({ id: '', title: '', description: '', lessons: [] })}
                  >
                    Add Module
                  </Button>
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