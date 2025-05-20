import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, userService } from '@/api/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, MapPin, Mail, User as UserIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Course, courseService } from '@/api/courseService';
import UserCourses from '@/components/profile/UserCourses';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Invalid Profile',
        description: 'No user ID provided.',
      });
      navigate('/');
      return;
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      toast({
        variant: 'destructive',
        title: 'Invalid User ID',
        description: 'The provided user ID is not valid.',
      });
      if (isAuthenticated && currentUser?.id) {
        navigate(`/profile/${currentUser.id}`);
        return;
      }
      navigate('/');
      return;
    }

    const fetchUserAndCourses = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching user with ID: ${id}`);
        const userData = await userService.getUserById(id);
        setUser(userData);

        // Fetch courses using the user's email as userId
        const userCourses = await courseService.getCoursesByUserId(userData.email);
        setCourses(userCourses);
      } catch (error: any) {
        console.error('Error fetching user or courses:', error);
        const errorMessage = error.message || 'Failed to load user profile or courses';
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
        if (error.response?.status === 404) {
          if (isAuthenticated && currentUser?.id) {
            navigate(`/profile/${currentUser.id}`);
          } else {
            navigate('/');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCourses();
  }, [id, isAuthenticated, currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-4 w-full max-w-md mb-2" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32 mb-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <p className="mb-6">The user profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const handlePostCreated = () => {
    setRefreshPosts(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 overflow-hidden">
          {user.coverPhotoBase64 && (
            <div className="h-48 overflow-hidden">
              <img
                src={`data:image/jpeg;base64,${user.coverPhotoBase64}`}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className={`p-6 ${!user.coverPhotoBase64 ? '' : '-mt-16'}`}>
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                {user.profilePhotoBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${user.profilePhotoBase64}`}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-4xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                  </div>

                  {isOwnProfile && (
                    <Link to={`/profile/edit/${id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                  {user.age && (
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>{user.age} years old</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="enrolled-courses">Enrolled Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{user.bio || 'No bio information available.'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <UserCourses
              courses={courses}
              isOwnProfile={isOwnProfile}
              onDeleteCourse={handleDeleteCourse}
            />
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-6">
              {isOwnProfile && (
                <PostForm onPostCreated={handlePostCreated} />
              )}
              <PostList userEmail={user.email} refreshTrigger={refreshPosts} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;