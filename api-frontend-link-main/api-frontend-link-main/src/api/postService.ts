import apiClient from './apiClient';

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
}

export const postService = {
  getAllPosts: async (page: number = 0, size: number = 10): Promise<Post[]> => {
  try {
    const response = await apiClient.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
},
  
  getPostById: async (id: string): Promise<Post> => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
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
  getPostsByUserEmail: async (email: string): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/posts?userEmail=${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${email}:`, error);
      throw error;
    }
  },

  // Like a post
  likePost: async (id: string): Promise<Post> => {
    try {
      const response = await apiClient.post(`/posts/${id}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking post ${id}:`, error);
      throw error;
    }
  },

  // Dislike a post
  dislikePost: async (id: string): Promise<Post> => {
    try {
      const response = await apiClient.post(`/posts/${id}/dislike`);
      return response.data;
    } catch (error) {
      console.error(`Error disliking post ${id}:`, error);
      throw error;
    }
  }
};
