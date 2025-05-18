
import apiClient from './apiClient';

export interface Post {
  id?: string;
  title: string;
  description: string;
  slogan: string;
  imageUrl?: string;
  userId?: string; // Added userId to track post ownership
  createdAt?: string;
}

export const postService = {
  getAllPosts: async (): Promise<Post[]> => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Return mock data as fallback
      return [
        {
          id: '1',
          title: 'Getting Started with React',
          description: 'Learn the basics of React and start building your first application',
          slogan: 'React made easy',
          imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
        },
        {
          id: '2',
          title: 'Mastering TypeScript',
          description: 'Dive deep into TypeScript features and improve your coding skills',
          slogan: 'Type safely, code confidently',
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
        }
      ];
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
      // Get current user ID and add to post if needed
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user && user.id && !post.get('userId')) {
        post.append('userId', user.id);
      }
      
      const response = await apiClient.post('/posts', post, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Create a fallback post with FormData values
      const title = post.get('title') as string;
      const description = post.get('description') as string;
      const slogan = post.get('slogan') as string;
      
      // Get current user ID
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const newPost = {
        id: Date.now().toString(),
        title,
        description,
        slogan,
        userId: user?.id, // Include userId for filtering
        createdAt: new Date().toISOString()
      };
      
      // Store in local storage
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      localPosts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(localPosts));
      
      return newPost;
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
      
      // Update locally as fallback
      const title = post.get('title') as string;
      const description = post.get('description') as string;
      const slogan = post.get('slogan') as string;
      
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = localPosts.map((p: Post) => 
        p.id === id ? { 
          ...p, 
          title, 
          description, 
          slogan, 
          updatedAt: new Date().toISOString() 
        } : p
      );
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      
      return { id, title, description, slogan } as Post;
    }
  },
  
  deletePost: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      
      // Delete locally as fallback
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const filteredPosts = localPosts.filter((p: Post) => p.id !== id);
      localStorage.setItem('posts', JSON.stringify(filteredPosts));
    }
  },
  
  // Get posts by user ID
   getPostsByUserId: async (userId: string): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/posts?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      return localPosts.filter((post: Post) => post.userId === userId);
    }
  }
};
