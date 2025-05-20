
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
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { User, userService } from '@/api/userService';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(1, 'Age must be at least 1'),
  location: z.string().optional(),
  bio: z.string().optional(),
});

const EditProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      age: undefined,
      location: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated || (currentUser?.id !== id)) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You can only edit your own profile",
      });
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get user data from the API
        const userData = await userService.getUserById(id);
        
        form.reset({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          age: userData.age,
          location: userData.location || '',
          bio: userData.bio || '',
        });

        if (userData.profilePhotoUrl) {
          setProfilePhotoPreview(userData.profilePhotoUrl);
        }
        
        if (userData.coverPhotoUrl) {
          setCoverPhotoPreview(userData.coverPhotoUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, isAuthenticated, currentUser, navigate, form]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated || (currentUser?.id !== id)) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You can only edit your own profile",
      });
      return;
    }

    try {
      // Create a FormData object to send to the API
      const formData = new FormData();
      
      // Append all the form values to the FormData object
      formData.append('name', values.name);
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('age', values.age.toString());
      
      if (values.location) {
        formData.append('location', values.location);
      }
      
      if (values.bio) {
        formData.append('bio', values.bio);
      }
      
      // Append the profile photo and cover photo if they exist
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      
      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }

      // Update user through the API by passing the FormData object
      await userService.updateUser(id!, formData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          <Card>
            <CardContent className="p-6">
              <p>Loading profile data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and profile photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Photo */}
                <div className="mb-6">
                  <FormLabel>Profile Photo</FormLabel>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-24 w-24">
                      {profilePhotoPreview ? (
                        <img 
                          src={profilePhotoPreview} 
                          alt="Profile preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-3xl font-bold">
                          {form.getValues("name")?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <Input 
                        id="profilePhoto" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePhotoChange}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 300x300 pixels
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cover Photo */}
                <div className="mb-6">
                  <FormLabel>Cover Photo</FormLabel>
                  <div className="mt-2">
                    {coverPhotoPreview && (
                      <div className="relative h-32 w-full mb-2 overflow-hidden rounded-md">
                        <img 
                          src={coverPhotoPreview} 
                          alt="Cover preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <Input 
                      id="coverPhoto" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverPhotoChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 1500x500 pixels
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="Your age" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardFooter className="px-0 pt-6">
                  <div className="flex justify-end gap-4 w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(`/profile/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
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

export default EditProfile;
