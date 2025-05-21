package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enrollment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Course;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.User;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.EnrollmentRepository;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.CourseRepository;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(
        EnrollmentRepository enrollmentRepository, 
        CourseRepository courseRepository,
        UserRepository userRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Enrollment enrollUser(String userEmail, String courseId) {
        System.out.println("[DEBUG] enrollUser called for userEmail: " + userEmail + ", courseId: " + courseId);
        // Check if user exists
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            System.out.println("[DEBUG] User not found: " + userEmail);
            throw new IllegalArgumentException("User not found");
        }

        // Check if course exists
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            System.out.println("[DEBUG] Course not found: " + courseId);
            throw new IllegalArgumentException("Course not found");
        }

        // Check if already enrolled
        if (enrollmentRepository.existsByUserEmailAndCourseId(userEmail, courseId)) {
            System.out.println("[DEBUG] User already enrolled: " + userEmail + " in course: " + courseId);
            throw new IllegalArgumentException("User is already enrolled in this course");
        }

        // Create enrollment
        Enrollment enrollment = new Enrollment(userEmail, courseId);
        enrollment = enrollmentRepository.save(enrollment);
        System.out.println("[DEBUG] Enrollment saved with ID: " + enrollment.getId());

        // Update user's enrolled courses
        User user = userOpt.get();
        user.addEnrolledCourse(courseId);
        userRepository.save(user);
        System.out.println("[DEBUG] User updated with enrolled course: " + courseId);

        return enrollment;
    }

    public Optional<Enrollment> getEnrollment(String userEmail, String courseId) {
        return enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
    }

    public List<Enrollment> getUserEnrollments(String userEmail) {
        return enrollmentRepository.findByUserEmail(userEmail);
    }

    @Transactional
    public Enrollment toggleLessonCompletion(String userEmail, String courseId, String lessonId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
        if (enrollmentOpt.isEmpty()) {
            throw new IllegalArgumentException("User is not enrolled in this course");
        }

        Enrollment enrollment = enrollmentOpt.get();
        if (enrollment.getCompletedLessonIds().contains(lessonId)) {
            enrollment.removeCompletedLesson(lessonId);
        } else {
            enrollment.addCompletedLesson(lessonId);
        }

        // Calculate progress
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            int totalLessons = course.getModules().stream()
                .mapToInt(module -> module.getLessons().size())
                .sum();
            int completedLessons = enrollment.getCompletedLessonIds().size();
            enrollment.setProgress((int) ((double) completedLessons / totalLessons * 100));
        }

        return enrollmentRepository.save(enrollment);
    }

    @Transactional(readOnly = true)
    public boolean isUserEnrolled(String userEmail, String courseId) {
        System.out.println("[DEBUG] ===== Enrollment Service Check =====");
        System.out.println("[DEBUG] Checking enrollment in database:");
        System.out.println("[DEBUG] - User Email: " + userEmail);
        System.out.println("[DEBUG] - Course ID: " + courseId);
        
        try {
            // First check if the course exists
            boolean courseExists = courseRepository.existsById(courseId);
            System.out.println("[DEBUG] Course exists in database: " + courseExists);
            
            if (!courseExists) {
                System.out.println("[DEBUG] Course not found in database");
                return false;
            }
            
            // Get all enrollments for this user for debugging
            List<Enrollment> allUserEnrollments = enrollmentRepository.findByUserEmail(userEmail);
            System.out.println("[DEBUG] All enrollments for user: " + allUserEnrollments);
            
            // Try direct query first
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
            if (enrollmentOpt.isPresent()) {
                Enrollment enrollment = enrollmentOpt.get();
                System.out.println("[DEBUG] Found enrollment directly:");
                System.out.println("[DEBUG] - ID: " + enrollment.getId());
                System.out.println("[DEBUG] - User Email: " + enrollment.getUserEmail());
                System.out.println("[DEBUG] - Course ID: " + enrollment.getCourseId());
                System.out.println("[DEBUG] - Progress: " + enrollment.getProgress());
                System.out.println("[DEBUG] - Completed Lessons: " + enrollment.getCompletedLessonIds());
                return true;
            }
            
            // If direct query fails, try exists query
            boolean exists = enrollmentRepository.existsByUserEmailAndCourseId(userEmail, courseId);
            System.out.println("[DEBUG] Enrollment exists check result: " + exists);
            
            if (!exists) {
                System.out.println("[DEBUG] No enrollment found for user " + userEmail + " in course " + courseId);
                // Double check with a raw query
                System.out.println("[DEBUG] Double checking with raw query...");
                List<Enrollment> rawQueryResults = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getUserEmail().equals(userEmail) && e.getCourseId().equals(courseId))
                    .toList();
                System.out.println("[DEBUG] Raw query results: " + rawQueryResults);
            }
            
            System.out.println("[DEBUG] ===== End Enrollment Service Check =====");
            return exists;
        } catch (Exception e) {
            System.out.println("[DEBUG] Error checking enrollment: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public void unenrollUser(String userEmail, String courseId) {
        System.out.println("[DEBUG] ===== Starting Unenrollment Process =====");
        System.out.println("[DEBUG] User Email: " + userEmail);
        System.out.println("[DEBUG] Course ID: " + courseId);
        
        try {
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                System.out.println("[DEBUG] User not found: " + userEmail);
                throw new IllegalArgumentException("User not found");
            }
            User user = userOpt.get();
            System.out.println("[DEBUG] Found user: " + user.getEmail());

            // Check if course exists
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                System.out.println("[DEBUG] Course not found: " + courseId);
                throw new IllegalArgumentException("Course not found");
            }
            Course course = courseOpt.get();
            System.out.println("[DEBUG] Found course: " + course.getCourseName());

            // Get all enrollments for this user-course combination
            List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                .filter(e -> e.getUserEmail().equals(userEmail) && e.getCourseId().equals(courseId))
                .toList();

            if (enrollments.isEmpty()) {
                System.out.println("[DEBUG] No enrollments found for user " + userEmail + " in course " + courseId);
                throw new IllegalArgumentException("User is not enrolled in this course");
            }

            System.out.println("[DEBUG] Found " + enrollments.size() + " enrollment(s) to delete");

            // Delete all enrollments
            try {
                for (Enrollment enrollment : enrollments) {
                    enrollmentRepository.delete(enrollment);
                    System.out.println("[DEBUG] Deleted enrollment: " + enrollment.getId());
                }
                System.out.println("[DEBUG] Successfully deleted all enrollments");
            } catch (Exception e) {
                System.out.println("[DEBUG] Error deleting enrollments: " + e.getMessage());
                throw new RuntimeException("Failed to delete enrollments", e);
            }

            // Update user's enrolled courses
            try {
                user.removeEnrolledCourse(courseId);
                userRepository.save(user);
                System.out.println("[DEBUG] Successfully updated user's enrolled courses");
            } catch (Exception e) {
                System.out.println("[DEBUG] Error updating user: " + e.getMessage());
                throw new RuntimeException("Failed to update user's enrolled courses", e);
            }

            System.out.println("[DEBUG] ===== Unenrollment Process Completed Successfully =====");
        } catch (IllegalArgumentException e) {
            System.out.println("[DEBUG] Validation error during unenrollment: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("[DEBUG] Unexpected error during unenrollment: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("An unexpected error occurred during unenrollment", e);
        }
    }
} 