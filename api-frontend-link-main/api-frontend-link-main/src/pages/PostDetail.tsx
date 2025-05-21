import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post, postService } from '@/api/postService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CommentSection from '@/components/CommentSection';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      toast({
        variant: "destructive",
        title: "Invalid Post",
        description: "No post ID provided.",
      });
      navigate('/posts');
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postData = await postService.getPostById(id);
        setPost(postData);
      } catch (error: any) {
        console.error('Error fetching post details:', error);
        const errorMessage = error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again later.'
          : error.response?.status === 404
          ? 'Post not found'
          : 'Failed to load post details';
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        if (error.response?.status === 404) {
          navigate('/posts');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to like this post.",
      });
      navigate('/login');
      return;
    }
    if (!post?.id || post.userInteraction === 'LIKE') return;
    try {
      const updatedPost = await postService.likePost(post.id);
      setPost(updatedPost);
      toast({ title: 'Success', description: 'Post liked' });
    } catch (error: any) {
      console.error('Error liking post:', error);
      const errorMessage = error.error === 'Authentication required'
        ? 'Session expired. Please log in again.'
        : error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : 'Failed to like post';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      if (error.error === 'Authentication required') {
        navigate('/login');
      }
    }
  };

  const handleDislikePost = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to dislike this post.",
      });
      navigate('/login');
      return;
    }
    if (!post?.id || post.userInteraction === 'DISLIKE') return;
    try {
      const updatedPost = await postService.dislikePost(post.id);
      setPost(updatedPost);
      toast({ title: 'Success', description: 'Post disliked' });
    } catch (error: any) {
      console.error('Error disliking post:', error);
      const errorMessage = error.error === 'Authentication required'
        ? 'Session expired. Please log in again.'
        : error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : 'Failed to dislike post';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      if (error.error === 'Authentication required') {
        navigate('/login');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-5/6"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-8 w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/posts">
          <Button>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Posts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/posts" className="inline-flex items-center text-purple-600 mb-6 hover:text-purple-800">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Posts
        </Link>
        
        <Card className="mb-8 shadow-lg">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-t-lg">
            {post.imageBase64 ? (
              <img 
                src={`data:image/jpeg;base64,${post.imageBase64}`}
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <CardContent className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="border-l-4 border-purple-600 pl-4 italic mb-6 text-gray-600">
              {post.slogan}
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-line">{post.description}</p>
            </div>

            <div className="flex items-center space-x-4 border-t pt-4">
              <Button
                onClick={handleLikePost}
                disabled={!isAuthenticated || post.userInteraction === 'LIKE'}
                className={`flex items-center space-x-1 ${
                  post.userInteraction === 'LIKE'
                    ? 'bg-green-500 text-white hover:bg-green-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                } transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500`}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{post.likes || 0}</span>
              </Button>
              <Button
                onClick={handleDislikePost}
                disabled={!isAuthenticated || post.userInteraction === 'DISLIKE'}
                className={`flex items-center space-x-1 ${
                  post.userInteraction === 'DISLIKE'
                    ? 'bg-red-500 text-white hover:bg-red-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                } transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500`}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{post.dislikes || 0}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;