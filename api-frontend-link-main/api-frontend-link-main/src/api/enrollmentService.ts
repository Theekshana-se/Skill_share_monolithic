import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Enrollment {
  id: string;
  userEmail: string;
  courseId: string;
  completedLessonIds: string[];
  progress: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found in localStorage');
    return {};
  }
  return { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export const enrollmentService = {
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        throw new Error('Authentication required to enroll in course');
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        throw new Error('User email not found');
      }

      console.log('Enrolling in course:', { courseId, userEmail: user.email });
      const response = await axios.post(
        `${API_URL}/enrollments/${courseId}`,
        { userEmail: user.email },
        { headers }
      );
      console.log('Enrollment successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Enrollment error:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Failed to enroll in course');
    }
  },

  async getUserEnrollments(): Promise<Enrollment[]> {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.log('No auth token, returning empty enrollments');
        return [];
      }
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        console.log('User email not found');
        return [];
      }
      
      console.log('Fetching user enrollments for email:', user.email);
      // Updated to use the correct endpoint from EnrollmentController
      const response = await axios.get(`${API_URL}/enrollments/user`, { headers });
      console.log('User enrollments response:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.warn('Expected array of enrollments but got:', response.data);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      if (axios.isAxiosError(error)) {
        console.log('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      return [];
    }
  },

  async toggleLessonCompletion(courseId: string, lessonId: string): Promise<Enrollment> {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        throw new Error('Authentication required to update lesson completion');
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        throw new Error('User email not found');
      }

      console.log('Toggling lesson completion:', { courseId, lessonId, userEmail: user.email });
      const response = await axios.post(
        `${API_URL}/enrollments/${courseId}/lessons/${lessonId}/toggle`,
        { userEmail: user.email },
        { headers }
      );
      console.log('Lesson completion updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Toggle lesson completion error:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Failed to toggle lesson completion');
    }
  },

  async isUserEnrolled(courseId: string): Promise<boolean> {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.log('[DEBUG] No auth token found in localStorage');
        return false;
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.email) {
        console.log('[DEBUG] User email not found in localStorage');
        return false;
      }
      
      console.log('[DEBUG] ===== Frontend Enrollment Check =====');
      console.log('[DEBUG] Course ID:', courseId);
      console.log('[DEBUG] User Email:', user.email);
      console.log('[DEBUG] Auth Headers:', headers);
      
      try {
        const response = await axios.get(`${API_URL}/enrollments/${courseId}/status`, { 
          headers,
          validateStatus: (status) => status < 500 // Don't throw on 404
        });
        
        console.log('[DEBUG] Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        
        if (response.status === 404) {
          console.log('[DEBUG] No enrollment found for this course');
          return false;
        }
        
        console.log('[DEBUG] ===== End Frontend Enrollment Check =====');
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('[DEBUG] Axios error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            message: error.message
          });
          
          if (error.response?.status === 404) {
            console.log('[DEBUG] No enrollment found for this course');
            return false;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('[DEBUG] Error checking enrollment status:', error);
      return false;
    }
  }
}; 