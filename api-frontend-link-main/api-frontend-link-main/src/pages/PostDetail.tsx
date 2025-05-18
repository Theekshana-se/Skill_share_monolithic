
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, postService } from '@/api/postService';
import { Comment, commentService } from '@/api/commentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchPostAndComments = async () => {
      setIsLoading(true);
      try {
        const postData = await postService.getPostById(id);
        setPost(postData);
        
        const commentsData = await commentService.getCommentsByPostId(id);
        setComments(commentsData);
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

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !id || !newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const comment: Comment = {
        postId: id,
        content: newComment,
        author: user?.name || 'Anonymous',
      };
      
      const createdComment = await commentService.createComment(comment);
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const updatedComment = await commentService.likeComment(commentId);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like comment",
      });
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    try {
      const updatedComment = await commentService.dislikeComment(commentId);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error('Error disliking comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to dislike comment",
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
        
        <div className="mb-8">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            <img 
              src={post.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="border-l-4 border-purple-600 pl-4 italic mb-6">
            {post.slogan}
          </div>
          
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{post.description}</p>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
          
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          ) : (
            <Card className="mb-8">
              <CardContent className="py-4 text-center">
                <p className="mb-3">Please log in to leave a comment</p>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-4">
                        {comment.avatarUrl ? (
                          <img src={comment.avatarUrl} alt={comment.author} />
                        ) : (
                          <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center font-bold">
                            {comment.author?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            {comment.author}
                            {comment.verified && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                Verified
                              </span>
                            )}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt || '').toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{comment.content}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <button 
                            onClick={() => comment.id && handleLikeComment(comment.id)}
                            className="flex items-center text-gray-500 hover:text-purple-600"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{comment.likes || 0}</span>
                          </button>
                          <button 
                            onClick={() => comment.id && handleDislikeComment(comment.id)}
                            className="flex items-center text-gray-500 hover:text-purple-600"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span>{comment.dislikes || 0}</span>
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-purple-600">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
