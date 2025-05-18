
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { postService } from '@/api/postService';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  slogan: z.string().optional(),
});

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      slogan: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please log in to edit posts",
      });
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const post = await postService.getPostById(id!);
        
        // Check if current user is the author
        if (post.userId && post.userId !== currentUser?.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You can only edit your own posts",
          });
          navigate('/posts');
          return;
        }
        
        form.reset({
          title: post.title,
          description: post.description,
          slogan: post.slogan || '',
        });
        
        if (post.imageUrl) {
          setImagePreview(post.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load post data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, isAuthenticated, currentUser, navigate, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      
      if (values.slogan) {
        formData.append('slogan', values.slogan);
      }
      
      if (image) {
        formData.append('image', image);
      }
      
      await postService.updatePost(id!, formData);
      
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated",
      });
      
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p>Loading post data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Post</CardTitle>
            <CardDescription>
              Make changes to your post and save them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your post content here" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slogan (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="A catchy slogan for your post" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Post Image</FormLabel>
                  {imagePreview && (
                    <div className="relative h-40 w-full mb-2 overflow-hidden rounded-md">
                      <img 
                        src={imagePreview} 
                        alt="Post image preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Upload a new image or leave empty to keep the current one
                  </p>
                </div>
                
                <CardFooter className="px-0 pt-6">
                  <div className="flex justify-end gap-4 w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(`/posts/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Post</Button>
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

export default EditPost;
