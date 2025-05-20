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
        if (EnrollmentRepository.existsByUserEmailAndCourseId(userEmail, courseId)) {
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

    public boolean isUserEnrolled(String userEmail, String courseId) {
        return EnrollmentRepository.existsByUserEmailAndCourseId(userEmail, courseId);
    }
} 