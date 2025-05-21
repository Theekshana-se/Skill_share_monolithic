import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, commentService } from '@/api/commentService';
import { toast } from '@/components/ui/use-toast';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import CommentItem from '../components/comments/CommentItem';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load comments",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to comment",
      });
      return;
    }

    try {
      const comment: Comment = {
        postId,
        content: newComment,
        userEmail: user.email,
        authorName: user.name,
        avatarUrl: user.avatarUrl,
        reply: false,
      };

      const createdComment = await commentService.createComment(comment);
      console.log('Created comment response:', createdComment);
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      });
    }
  };

  const handleUpdateComment = (commentId: string, newContent: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
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
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] border-gray-300 focus:border-purple-500"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()} className="bg-purple-600 text-white hover:bg-purple-700">
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="py-4 text-center">
            <p>Please log in to leave a comment</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="overflow-hidden border-0 shadow-md bg-white/90 backdrop-blur-md">
            <CardContent className="p-4">
              <CommentItem
                comment={comment}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
              <div className="mt-2 flex items-center space-x-4 pl-14">
                <button
                  onClick={() => handleLikeComment(comment.id!)}
                  className="flex items-center text-gray-500 hover:text-purple-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes || 0}</span>
                </button>
                <button
                  onClick={() => handleDislikeComment(comment.id!)}
                  className="flex items-center text-gray-500 hover:text-purple-600"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span>{comment.dislikes || 0}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;