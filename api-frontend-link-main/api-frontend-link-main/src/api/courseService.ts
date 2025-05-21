import apiClient from './apiClient';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

export interface Lesson {
  id?: string; // Optional for new lessons
  title: string; // Required
  content?: string; // Optional
}

export interface Module {
  id?: string; // Optional for new modules
  title: string; // Required
  description?: string; // Optional
  lessons: Lesson[]; // Required array
}

export interface Course {
  id?: string;
  courseName: string;
  courseLevel: string;
  institute: string;
  startDate?: string;
  duration: number;
  courseType: string;
  progress: number;
  userId?: string;
  modules?: Module[]; // Optional array
  thumbnail?: string; // Base64 encoded image string
}

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await axios.get(`${API_URL}/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: TIMEOUT
        });
        
        return response.data;
      } catch (error) {
        retries++;
        console.error(`Attempt ${retries} failed to fetch course with ID ${id}:`, error);
        
        if (retries === MAX_RETRIES) {
          console.error(`All ${MAX_RETRIES} attempts failed to fetch course with ID ${id}`);
          throw new Error('Failed to fetch course details after multiple attempts');
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
    
    throw new Error('Failed to fetch course details');
  },

  createCourse: async (course: Course): Promise<Course> => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        throw new Error('User email is required to create a course');
      }
      
      course.userId = user.email;
      console.log('Creating course with data:', course);
      
      const response = await apiClient.post('/courses', course);
      console.log('Course created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, course: Course): Promise<Course> => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        throw new Error('User email is required to update a course');
      }
      
      course.userId = user.email;
      console.log('Updating course with data:', course);
      
      const response = await apiClient.put(`/courses/${id}`, course);
      console.log('Course updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/courses/${id}`);
      console.log('Course deleted successfully');
    } catch (error) {
      console.error(`Error deleting course with ID ${id}:`, error);
      throw error;
    }
  },

  getCoursesByUserId: async (userId: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get(`/courses?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for user ${userId}:`, error);
      throw error;
    }
  }
};