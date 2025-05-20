import React, { useState } from 'react';
import { Comment, commentService } from '@/api/commentService';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, newContent: string) => void;
}

const CommentItem = ({ comment, onDelete, onUpdate }: CommentItemProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);

  // Normalize emails for comparison
  const normalizedUserEmail = user?.email?.trim().toLowerCase() || '';
  const normalizedCommentEmail = comment.userEmail?.trim().toLowerCase() || '';
  const isOwnComment = normalizedUserEmail === normalizedCommentEmail;

  const handleEdit = async () => {
    if (isEditing) {
      setIsLoading(true);
      try {
        const updatedComment = await commentService.updateComment(comment.id!, editContent);
        onUpdate(comment.id!, editContent);
        setIsEditing(false);
        toast({
          title: "Comment updated",
          description: "Your comment has been successfully updated."
        });
      } catch (error: any) {
        console.error('Error updating comment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update comment. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    toast({
      title: "Delete Comment",
      description: "Are you sure you want to delete this comment?",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            setIsLoading(true);
      try {
              await commentService.deleteComment(comment.id!, comment.postId);
        onDelete(comment.id!);
        toast({
          title: "Comment deleted",
          description: "Your comment has been successfully deleted."
        });
            } catch (error: any) {
        console.error('Error deleting comment:', error);
        toast({
          variant: "destructive",
          title: "Error",
                description: error.message || "Failed to delete comment. Please try again."
        });
            } finally {
              setIsLoading(false);
    }
          }}
        >
          Confirm
        </Button>
      ),
    });
  };

  return (
    <div className="flex gap-4 mb-6">
        <Avatar className="h-10 w-10">
          {comment.avatarUrl ? (
            <img src={comment.avatarUrl} alt={comment.authorName || comment.userEmail} className="h-full w-full object-cover" />
          ) : (
            <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-sm font-bold">
              {(comment.authorName?.charAt(0) || comment.userEmail?.charAt(0) || '?').toUpperCase()}
            </div>
          )}
        </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{comment.authorName || comment.userEmail}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt || '').toLocaleDateString()}
            </p>
          </div>
          
          {isOwnComment && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2"
              disabled={isLoading}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleEdit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;