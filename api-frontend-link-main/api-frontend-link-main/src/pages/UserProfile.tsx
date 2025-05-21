import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, userService } from '@/api/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, MapPin, Mail, User as UserIcon, BookOpen, MessageCircle, GraduationCap, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Course, courseService } from '@/api/courseService';
import UserCourses from '@/components/profile/UserCourses';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';
import UserEnrolledCourses from '@/components/profile/UserEnrolledCourses';
import UserPosts from '@/components/profile/UserPosts';
import { Post, postService } from '@/api/postService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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

    const fetchUserAndCoursesAndPosts = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching user with ID: ${id}`);
        const userData = await userService.getUserById(id);
        setUser(userData);

        // Fetch courses using the user's email as userId
        const userCourses = await courseService.getCoursesByUserId(userData.email);
        setCourses(userCourses);

        // Fetch posts by user email
        const userPosts = await postService.getPostsByUserEmail(userData.email);
        setPosts(userPosts);
      } catch (error: any) {
        console.error('Error fetching user, courses, or posts:', error);
        const errorMessage = error.message || 'Failed to load user profile, courses, or posts';
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

    fetchUserAndCoursesAndPosts();
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

  const handleDeleteProfile = async () => {
    try {
      await userService.deleteUser(id!);
      toast({
        title: "Profile Deleted",
        description: "Your profile has been successfully deleted.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete profile",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 overflow-hidden bg-white/90 shadow-xl rounded-3xl border border-gray-200">
          {user.coverPhotoBase64 && (
            <div className="h-56 w-full overflow-hidden">
              <img
                src={`data:image/jpeg;base64,${user.coverPhotoBase64}`}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Profile Details Below Cover */}
          <div className="flex flex-col items-center -mt-14 mb-6">
            <Avatar className="h-40 w-40 border-4 border-white shadow-lg bg-white">
              {user.profilePhotoBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${user.profilePhotoBase64}`}
                  alt={user.name}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-5xl font-bold rounded-full">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
            <div className="mt-4 flex flex-col items-center">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-gray-500 mb-2">@{user.username}</p>
              <div className="flex flex-wrap gap-4 justify-center mb-2">
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
              {isOwnProfile && (
                <div className="flex gap-2 mt-2">
                  <Link to={`/profile/edit/${id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Profile
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your profile
                          and all associated data including courses, posts, and comments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProfile} className="bg-red-600 hover:bg-red-700">
                          Delete Profile
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="about">
          <TabsList className="mt-4 mb-8 flex justify-center gap-4 bg-gray-100 rounded-full p-2 shadow-md w-full max-w-2xl mx-auto h-14">
            <TabsTrigger value="about" className="flex flex-col items-center justify-center gap-1 h-10 min-w-[110px] rounded-full text-lg font-semibold text-gray-700 transition relative data-[state=active]:text-purple-700 data-[state=active]:bg-transparent focus:bg-transparent">
              <span className="flex items-center justify-center gap-2 h-full"><UserIcon className="h-5 w-5" /> About</span>
              <span className="h-2 w-2 rounded-full bg-purple-600 mt-1 transition-opacity duration-200 data-[state=active]:opacity-100 opacity-0"></span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex flex-col items-center justify-center gap-1 h-10 min-w-[110px] rounded-full text-lg font-semibold text-gray-700 transition relative data-[state=active]:text-purple-700 data-[state=active]:bg-transparent focus:bg-transparent">
              <span className="flex items-center justify-center gap-2 h-full"><BookOpen className="h-5 w-5" /> Courses</span>
              <span className="h-2 w-2 rounded-full bg-purple-600 mt-1 transition-opacity duration-200 data-[state=active]:opacity-100 opacity-0"></span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex flex-col items-center justify-center gap-1 h-10 min-w-[110px] rounded-full text-lg font-semibold text-gray-700 transition relative data-[state=active]:text-purple-700 data-[state=active]:bg-transparent focus:bg-transparent">
              <span className="flex items-center justify-center gap-2 h-full"><MessageCircle className="h-5 w-5" /> Posts</span>
              <span className="h-2 w-2 rounded-full bg-purple-600 mt-1 transition-opacity duration-200 data-[state=active]:opacity-100 opacity-0"></span>
            </TabsTrigger>
            <TabsTrigger value="enrolled-courses" className="flex flex-col items-center justify-center gap-1 h-10 min-w-[110px] rounded-full text-lg font-semibold text-gray-700 transition relative data-[state=active]:text-purple-700 data-[state=active]:bg-transparent focus:bg-transparent">
              <span className="flex items-center justify-center gap-2 h-full"><GraduationCap className="h-5 w-5" /> Enrolled</span>
              <span className="h-2 w-2 rounded-full bg-purple-600 mt-1 transition-opacity duration-200 data-[state=active]:opacity-100 opacity-0"></span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="mb-6">
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
            <UserPosts
              posts={posts}
              isOwnProfile={isOwnProfile}
              onDeletePost={(postId) => setPosts(posts.filter((post) => post.id !== postId))}
            />
          </TabsContent>

          <TabsContent value="enrolled-courses">
            <UserEnrolledCourses />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;