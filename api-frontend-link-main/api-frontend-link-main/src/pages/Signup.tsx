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

    // Optional: Validate file types and sizes
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="13"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="New York"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverPhoto">Cover Photo</Label>
              <Input
                id="coverPhoto"
                name="coverPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;