
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '@/api/postService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Image } from 'lucide-react';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slogan: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for submission including the image
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('slogan', formData.slogan);
      if (image) {
        data.append('image', image);
      }
      
      const response = await postService.createPost(data);
      
      toast({
        title: "Post created",
        description: "Your post has been created successfully!",
      });
      
      navigate(`/posts/${response.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a catchy title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your post in detail"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input
                id="slogan"
                name="slogan"
                placeholder="A short, catchy slogan"
                value={formData.slogan}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Cover Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto max-h-64 object-contain"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="image" 
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Image className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-500 mt-1">
                      (JPEG, PNG, GIF up to 10MB)
                    </span>
                  </label>
                )}
              </div>
            </div>

            <CardFooter className="px-0 pb-0">
              <div className="flex justify-end gap-4 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/posts')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
