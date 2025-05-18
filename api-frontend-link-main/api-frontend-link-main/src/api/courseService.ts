import apiClient from './apiClient';

export interface Lesson {
  id?: string;
  title: string;
  content?: string;
}

export interface Module {
  id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
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
  modules?: Module[];
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
          userId: '6829528800de5d639525c2e0',
          modules: []
        }
      ];
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  },

  createCourse: async (course: Course): Promise<Course> => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    try {
      if (user && user.id) {
        course.userId = user.id; // Use ObjectId from auth
      }
      const response = await apiClient.post('/courses', course);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      const localCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const newCourse = {
        ...course,
        id: Date.now().toString(),
        userId: user?.id,
        modules: course.modules || []
      };
      localCourses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(localCourses));
      return newCourse;
    }
  },

  updateCourse: async (id: string, course: Course): Promise<Course> => {
    try {
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