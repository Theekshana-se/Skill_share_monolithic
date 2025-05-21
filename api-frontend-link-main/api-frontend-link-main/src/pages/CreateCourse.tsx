import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import { Plus, Trash2, ImagePlus, X } from 'lucide-react';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

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
  thumbnail: z.string().optional(),
});

interface ModuleCardProps {
  module: FieldArrayWithId<z.infer<typeof formSchema>, 'modules', 'id'>;
  moduleIndex: number;
  onRemove: (index: number) => void;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const ModuleCard = ({ module, moduleIndex, onRemove, form }: ModuleCardProps) => {
  const { fields: lessonFields, append: appendLesson, remove: removeLesson } = useFieldArray({
    control: form.control,
    name: `modules.${moduleIndex}.lessons`
  });

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-white to-indigo-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Module {moduleIndex + 1}</h3>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(moduleIndex)}
            disabled={moduleFields.length === 1}
            className="hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Remove
          </Button>
        </div>
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Module Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Introduction to Programming" className="border-gray-300 focus:border-purple-500" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.description`}
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-700">Module Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the module content" className="border-gray-300 focus:border-purple-500" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Lessons</h4>
          {lessonFields.map((lesson, lessonIndex) => (
            <div key={lesson.id} className="ml-6 border-l-2 border-purple-200 pl-4 mb-4 bg-white/80 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium text-gray-600">Lesson {lessonIndex + 1}</h5>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeLesson(lessonIndex)}
                  disabled={lessonFields.length === 1}
                  className="hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Variables and Data Types" className="border-gray-300 focus:border-purple-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="text-gray-700">Lesson Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter lesson content" className="border-gray-300 focus:border-purple-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 bg-purple-50 text-purple-600 hover:bg-purple-100"
            onClick={() => appendLesson({ title: '', content: '' })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: '',
      courseLevel: 'Beginner',
      institute: '',
      startDate: '',
      duration: 1,
      courseType: 'Online',
      modules: [{ title: '', description: '', lessons: [{ title: '', content: '' }] }],
      thumbnail: ''
    }
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control,
    name: 'modules'
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
        setImagePreview(base64String);
        form.setValue('thumbnail', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('thumbnail', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to create a course',
      });
      navigate('/login');
      return;
    }

    try {
      console.log('Form values before submission:', values); // Debug log
      const courseData: Course = {
        courseName: values.courseName,
        courseLevel: values.courseLevel,
        institute: values.institute,
        startDate: values.startDate,
        duration: values.duration,
        courseType: values.courseType,
        progress: 0,
        userId: user.email,
        thumbnail: values.thumbnail, // Ensure thumbnail is included
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
      console.log('Course data being sent:', courseData); // Debug log

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

  useEffect(() => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to create a course',
      });
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Course</h1>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold text-gray-800">Course Details</CardTitle>
            <CardDescription className="text-gray-600">
              Craft your course with engaging modules and lessons
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Thumbnail Upload Section */}
                <div className="space-y-4">
                  <FormLabel className="text-gray-700">Course Thumbnail</FormLabel>
                  <div className="flex flex-col items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreview}
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
                          ref={fileInputRef}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Course Fields */}
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development Fundamentals" className="border-gray-300 focus:border-purple-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Institute/Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tech Academy" className="border-gray-300 focus:border-purple-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Course Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-purple-500">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="Beginner" className="hover:bg-purple-50">Beginner</SelectItem>
                              <SelectItem value="Intermediate" className="hover:bg-purple-50">Intermediate</SelectItem>
                              <SelectItem value="Advanced" className="hover:bg-purple-50">Advanced</SelectItem>
                            </SelectContent>
                          </Select>     
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Course Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-purple-500">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border-gray-200">
                                <SelectItem value="Online" className="hover:bg-purple-50">Online</SelectItem>
                                <SelectItem value="In-Person" className="hover:bg-purple-50">In-Person</SelectItem>
                                <SelectItem value="Hybrid" className="hover:bg-purple-50">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                        <FormMessage className="text-red-500" />
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
                        <FormLabel className="text-gray-700">Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="border-gray-300 focus:border-purple-500" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Duration (weeks)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" className="border-gray-300 focus:border-purple-500" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Modules */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Modules & Lessons</h2>
                  {moduleFields.map((module, moduleIndex) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      moduleIndex={moduleIndex}
                      onRemove={removeModule}
                      form={form}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-purple-50 text-purple-600 hover:bg-purple-100 w-full md:w-auto"
                    onClick={() => appendModule({ title: '', description: '', lessons: [{ title: '', content: '' }] })}
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Module
                  </Button>
                </div>

                <CardFooter className="px-0 pt-6">
                  <div className="flex justify-end gap-4 w-full">
                    <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => navigate('/courses')}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">Create Course</Button>
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