import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Comment {
  id?: string;
  postId: string;
  content: string;
  userEmail: string; // Ensure this matches the backend's serialized field name
  authorName?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
  dislikes?: number;
  reply: boolean;
  replyTo?: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    console.log('Token refreshed successfully:', newToken.substring(0, 10) + '...');
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw new Error('Session expired. Please log in again.');
  }
}

export const commentService = {
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await axios.get(`${API_URL}/comments/post/${postId}`, {
        headers: getAuthHeaders(),
      });
      console.log('Fetched comments raw response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },
  
  createComment: async (comment: Comment): Promise<Comment> => {
    try {
      const response = await axios.post(`${API_URL}/comments`, comment, {
        headers: getAuthHeaders(),
      });
      console.log('Create comment API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    try {
      console.log('Updating comment:', { id, content });
      const headers = getAuthHeaders();
      
      const response = await axios.put(
        `${API_URL}/comments/${id}`,
        { content },
        { 
          headers,
          validateStatus: (status) => status < 500
        }
      );
      
      if (response.status === 403) {
        throw new Error('You are not authorized to edit this comment');
      }
      
      if (response.status === 401) {
        throw new Error('Please log in to edit comments');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating comment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update comment');
    }
  },
  
  deleteComment: async (id: string, postId: string): Promise<void> => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.delete(`${API_URL}/comments/${id}`, {
        headers,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 403) {
        throw new Error('You are not authorized to delete this comment');
      }
      
      if (response.status === 401) {
        throw new Error('Please log in to delete comments');
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete comment');
    }
  },
  
  likeComment: async (id: string): Promise<Comment> => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${id}/like`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },
  
  dislikeComment: async (id: string): Promise<Comment> => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${id}/dislike`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error disliking comment:', error);
      throw error;
    }
  },
};