import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { userService } from '@/api/userService';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 18,
    location: '',
    bio: '',
    profilePhoto: null,
    coverPhoto: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] || null : type === 'number' ? parseInt(value) || 18 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
      });
      return;
    }

    if (formData.profilePhoto && !['image/jpeg', 'image/png'].includes(formData.profilePhoto.type)) {
      toast({
        variant: "destructive",
        title: "Invalid profile photo",
        description: "Please upload a JPEG or PNG image",
      });
      return;
    }
    if (formData.coverPhoto && !['image/jpeg', 'image/png'].includes(formData.coverPhoto.type)) {
      toast({
        variant: "destructive",
        title: "Invalid cover photo",
        description: "Please upload a JPEG or PNG image",
      });
      return;
    }
    if (formData.profilePhoto && formData.profilePhoto.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Profile photo too large",
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }
    if (formData.coverPhoto && formData.coverPhoto.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Cover photo too large",
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('age', formData.age.toString());
      if (formData.location) data.append('location', formData.location);
      if (formData.bio) data.append('bio', formData.bio);
      if (formData.profilePhoto) data.append('profilePhoto', formData.profilePhoto);
      if (formData.coverPhoto) data.append('coverPhoto', formData.coverPhoto);

      await userService.createUser(data);

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please log in.",
      });

      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Account creation failed",
        description: error.response?.data || "There was an error creating your account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Join Our Community</h1>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold text-gray-800">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="13"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="New York"
                  value={formData.location}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto" className="text-gray-700">Profile Photo</Label>
                  <Input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleChange}
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverPhoto" className="text-gray-700">Cover Photo</Label>
                  <Input
                    id="coverPhoto"
                    name="coverPhoto"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleChange}
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-b-lg">
            <div className="w-full text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;