import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postData = await postService.getPostById(id);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load post details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLikePost = async () => {
    if (!post?.id) return;
    try {
      const updatedPost = await postService.likePost(post.id);
      setPost(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like post",
      });
    }
  };

  const handleDislikePost = async () => {
    if (!post?.id) return;
    try {
      const updatedPost = await postService.dislikePost(post.id);
      setPost(updatedPost);
    } catch (error) {
      console.error('Error disliking post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to dislike post",
      });
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
        <Link to="/posts" className="inline-flex items-center text-purple-600 mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Posts
        </Link>
        
        <Card className="mb-8">
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
            <div className="border-l-4 border-purple-600 pl-4 italic mb-6">
              {post.slogan}
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-line">{post.description}</p>
            </div>

            <div className="flex items-center space-x-4 border-t pt-4">
              <button
                onClick={handleLikePost}
                className="flex items-center text-gray-500 hover:text-purple-600"
              >
                <ThumbsUp className="h-5 w-5 mr-1" />
                <span>{post.likes || 0}</span>
              </button>
              <button
                onClick={handleDislikePost}
                className="flex items-center text-gray-500 hover:text-purple-600"
              >
                <ThumbsDown className="h-5 w-5 mr-1" />
                <span>{post.dislikes || 0}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <CommentSection postId={post.id!} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
