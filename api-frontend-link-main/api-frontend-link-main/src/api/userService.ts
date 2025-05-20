import apiClient from './apiClient';
import { courseService, Course } from './courseService';
import { postService, Post } from './postService';

export interface User {
  avatarUrl: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  age: number;
  location?: string;
  bio?: string;
  profilePhotoBase64?: string;
  coverPhotoBase64?: string;
  roles?: string[];
}

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  createUser: async (formData: FormData): Promise<User> => {
    try {
      const response = await apiClient.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || error;
    }
  },

  updateUser: async (id: string, formData: FormData): Promise<User> => {
    try {
      const response = await apiClient.put(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update local storage if current user
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.id === id) {
          localStorage.setItem('user', JSON.stringify({
            ...parsedUser,
            ...response.data,
          }));
        }
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
      // Log out if current user
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.id === id) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  getUserCourses: async (userId: string): Promise<Course[]> => {
    try {
      return await courseService.getCoursesByUserId(userId);
    } catch (error: any) {
      console.error(`Error fetching courses for user ${userId}:`, error);
      return []; // Return empty array on error
    }
  },

  // getUserPosts: async (userId: string): Promise<Post[]> => {
  //   try {
  //     return await postService.getPostsByUserId(userId);
  //   } catch (error: any) {
  //     console.error(`Error fetching posts for user ${userId}:`, error);
  //     return []; // Return empty array on error
  //   }
  // },
};