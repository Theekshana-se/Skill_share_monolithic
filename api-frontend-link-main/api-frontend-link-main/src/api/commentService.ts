
import apiClient from './apiClient';

export interface Comment {
  id?: string;
  postId: string;
  author: string;
  avatarUrl?: string;
  createdAt?: string;
  content: string;
  likes?: number;
  dislikes?: number;
  verified?: boolean;
  reply?: boolean;
  replyTo?: string;
}

export const commentService = {
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await apiClient.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      // Return mock or local data as fallback
      const localComments = localStorage.getItem(`comments_${postId}`);
      return localComments ? JSON.parse(localComments) : [];
    }
  },
  
  createComment: async (comment: Comment): Promise<Comment> => {
    try {
      const response = await apiClient.post('/comments', comment);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      // Store comment locally as fallback
      const newComment = {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };
      
      const localComments = JSON.parse(localStorage.getItem(`comments_${comment.postId}`) || '[]');
      localComments.push(newComment);
      localStorage.setItem(`comments_${comment.postId}`, JSON.stringify(localComments));
      
      return newComment;
    }
  },
  
  replyToComment: async (commentId: string, reply: Comment): Promise<Comment> => {
    try {
      const response = await apiClient.post(`/comments/${commentId}/reply`, reply);
      return response.data;
    } catch (error) {
      console.error(`Error replying to comment ${commentId}:`, error);
      // Store reply locally as fallback
      const newReply = {
        ...reply,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        reply: true,
        replyTo: commentId,
        likes: 0,
        dislikes: 0
      };
      
      const localComments = JSON.parse(localStorage.getItem(`comments_${reply.postId}`) || '[]');
      localComments.push(newReply);
      localStorage.setItem(`comments_${reply.postId}`, JSON.stringify(localComments));
      
      return newReply;
    }
  },
  
  likeComment: async (commentId: string): Promise<Comment> => {
    try {
      const response = await apiClient.put(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error;
    }
  },
  
  dislikeComment: async (commentId: string): Promise<Comment> => {
    try {
      const response = await apiClient.put(`/comments/${commentId}/dislike`);
      return response.data;
    } catch (error) {
      console.error(`Error disliking comment ${commentId}:`, error);
      throw error;
    }
  },
  
  // Add methods for editing and deleting comments
  updateComment: async (id: string, content: string): Promise<Comment> => {
    try {
      const response = await apiClient.put(`/comments/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      // Update comment locally as fallback
      const postId = id.split('_')[0]; // Assuming comment IDs include the post ID
      const localComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
      const updatedComments = localComments.map((c: Comment) => 
        c.id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c
      );
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
      
      const updatedComment = updatedComments.find((c: Comment) => c.id === id);
      return updatedComment || { id, content } as Comment;
    }
  },
  
  deleteComment: async (id: string, postId: string): Promise<void> => {
    try {
      await apiClient.delete(`/comments/${id}`);
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      // Delete comment locally as fallback
      const localComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
      const filteredComments = localComments.filter((c: Comment) => c.id !== id);
      localStorage.setItem(`comments_${postId}`, JSON.stringify(filteredComments));
    }
  }
};
