
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
  const isOwnComment = user?.id === comment.author; // This assumes author field stores user ID

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await commentService.updateComment(comment.id!, editContent);
        onUpdate(comment.id!, editContent);
        setIsEditing(false);
        toast({
          title: "Comment updated",
          description: "Your comment has been successfully updated."
        });
      } catch (error) {
        console.error('Error updating comment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update comment. Please try again."
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.deleteComment(comment.id!, comment.postId);
        onDelete(comment.id!);
        toast({
          title: "Comment deleted",
          description: "Your comment has been successfully deleted."
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete comment. Please try again."
        });
      }
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <Avatar className="h-10 w-10">
        {comment.avatarUrl ? (
          <img src={comment.avatarUrl} alt={comment.author} className="h-full w-full object-cover" />
        ) : (
          <div className="bg-purple-200 text-purple-600 h-full w-full flex items-center justify-center text-sm font-bold">
            {comment.author?.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{comment.author}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt || '').toLocaleDateString()}
            </p>
          </div>
          
          {isOwnComment && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
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
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleEdit}>
                Save
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