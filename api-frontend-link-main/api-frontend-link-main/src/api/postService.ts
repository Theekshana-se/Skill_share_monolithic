//import apiClient from './apiClient';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000, // Temporary increase to avoid timeouts
  headers: { 'Content-Type': 'application/json' }
});

// Add JWT token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Post {
  id?: string;
  title: string;
  description: string;
  slogan: string;
  imageUrl?: string;
  imageBase64?: string;
  userEmail: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
  dislikes?: number;
  userInteraction: string | null; // "LIKE", "DISLIKE", or null
}

export const postService = {
  getPostById: async (id: string): Promise<Post> => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching post ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  getAllPosts: async (page: number = 0, size: number = 10): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/posts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  createPost: async (post: FormData): Promise<Post> => {
    try {
      // Get current user email from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.email && !post.get('userEmail')) {
        post.append('userEmail', user.email);
      }
      
      const response = await apiClient.post('/posts', post, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  updatePost: async (id: string, post: FormData): Promise<Post> => {
    try {
      const response = await apiClient.put(`/posts/${id}`, post, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
  
  deletePost: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },
  
  // Get posts by user email
  getPostsByUserEmail: async (email: string, page: number = 0, size: number = 10): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/posts?userEmail=${email}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for email ${email}:`, error);
      throw error;
    }
  },

  // Like a post
  likePost: async (postId: string): Promise<Post> => {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      console.error(`Error liking post ${postId}:`, error);
      throw error.response?.data || error;
    }
  },

  // Dislike a post
  dislikePost: async (postId: string): Promise<Post> => {
    try {
      const response = await apiClient.post(`/posts/${postId}/dislike`);
      return response.data;
    } catch (error: any) {
      console.error(`Error disliking post ${postId}:`, error);
      throw error.response?.data || error;
    }
  },
};
