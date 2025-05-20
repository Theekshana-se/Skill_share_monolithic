import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  progress: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const enrollmentService = {
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    try {
      const response = await axios.post(
        `${API_URL}/enrollments/${courseId}`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Failed to enroll in course');
    }
  },

  async getUserEnrollments(): Promise<Enrollment[]> {
    try {
      const response = await axios.get(`${API_URL}/enrollments/user`, {
        headers: getAuthHeaders(),
      });
      // Ensure we're returning an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      return [];
    }
  },

  async toggleLessonCompletion(courseId: string, lessonId: string): Promise<Enrollment> {
    try {
      const response = await axios.post(
        `${API_URL}/enrollments/${courseId}/lessons/${lessonId}/toggle`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Failed to toggle lesson completion');
    }
  },

  async isUserEnrolled(courseId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${API_URL}/enrollments/${courseId}/status`,
        { headers: getAuthHeaders() }
      );
      return response.data === true;
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }
  }
}; 