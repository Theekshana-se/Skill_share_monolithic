package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enrollment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:8081", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable String courseId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Enrollment enrollment = enrollmentService.enrollUser(userEmail, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(userEmail);
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping("/{courseId}/lessons/{lessonId}/toggle")
    public ResponseEntity<?> toggleLessonCompletion(
            @PathVariable String courseId,
            @PathVariable String lessonId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Enrollment enrollment = enrollmentService.toggleLessonCompletion(userEmail, courseId, lessonId);
            return ResponseEntity.ok(enrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{courseId}/status")
    public ResponseEntity<Boolean> isUserEnrolled(
            @PathVariable String courseId,
            Authentication authentication
    ) {
        System.out.println("[DEBUG] ===== Enrollment Status Check =====");
        System.out.println("[DEBUG] Course ID: " + courseId);

        if (authentication == null) {
            System.out.println("[DEBUG] No authentication found in context");
            return ResponseEntity.ok(false);
        }

        String userEmail = authentication.getName();
        System.out.println("[DEBUG] User email from authentication: " + userEmail);
        System.out.println("[DEBUG] Authentication details: " + authentication);

        boolean isEnrolled = enrollmentService.isUserEnrolled(userEmail, courseId);
        System.out.println("[DEBUG] Enrollment check result: " + isEnrolled);
        System.out.println("[DEBUG] ===== End Enrollment Status Check =====");

        return ResponseEntity.ok(isEnrolled);
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unenrollFromCourse(
            @PathVariable String courseId,
            Authentication auth
    ) {
        System.out.println("[DEBUG] ===== Unenrollment Request Received =====");
        System.out.println("[DEBUG] Course ID: " + courseId);
        
        try {
            String userEmail = auth.getName();
            System.out.println("[DEBUG] User email from auth: " + userEmail);
            
            enrollmentService.unenrollUser(userEmail, courseId);
            
            System.out.println("[DEBUG] Unenrollment successful");
            return ResponseEntity.ok().body("Successfully unenrolled from course");
        } catch (IllegalArgumentException e) {
            System.out.println("[DEBUG] Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.out.println("[DEBUG] Runtime error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("[DEBUG] Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        } finally {
            System.out.println("[DEBUG] ===== Unenrollment Request Completed =====");
        }
    }
}