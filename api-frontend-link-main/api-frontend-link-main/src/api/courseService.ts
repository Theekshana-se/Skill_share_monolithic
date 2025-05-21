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
      return [
        {
          id: '1',
          courseName: 'Web Development Fundamentals',
          courseLevel: 'Beginner',
          institute: 'Tech Academy',
          startDate: '2023-06-01',
          duration: 8,
          courseType: 'Online',
          progress: 75,
          userId: 'example@example.com', // Use email
          modules: []
        }
      ];
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
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    try {
      if (user && user.email) {
        course.userId = user.email; // Use email from auth
      }
      console.log('Creating course with data:', course); // Debug log
      const response = await apiClient.post('/courses', course);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      const localCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const newCourse = {
        ...course,
        id: Date.now().toString(),
        userId: user?.email || 'default@example.com',
        modules: course.modules || []
      };
      localCourses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(localCourses));
      return newCourse;
    }
  },

  updateCourse: async (id: string, course: Course): Promise<Course> => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    try {
      if (user && user.email) {
        course.userId = user.email; // Use email from auth
      }
      console.log('Updating course with data:', course); // Debug log
      const response = await apiClient.put(`/courses/${id}`, course);
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${id}:`, error);
      const localCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const updatedCourses = localCourses.map((c: Course) =>
        c.id === id ? { ...c, ...course } : c
      );
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      return { ...course, id };
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/courses/${id}`);
    } catch (error) {
      console.error(`Error deleting course with ID ${id}:`, error);
      const localCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const filteredCourses = localCourses.filter((c: Course) => c.id !== id);
      localStorage.setItem('courses', JSON.stringify(filteredCourses));
    }
  },

  getCoursesByUserId: async (userId: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get(`/courses?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for user ${userId}:`, error);
      const localCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      return localCourses.filter((course: Course) => course.userId === userId);
    }
  }
};