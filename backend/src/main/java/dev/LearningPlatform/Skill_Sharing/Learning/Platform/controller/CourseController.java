package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Course;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course, Authentication auth) {
        String userEmail = auth.getName(); // Extract email from JWT
        course.setUserId(userEmail); // Set userId as email
        Course savedCourse = courseService.createCourse(course);
        return ResponseEntity.ok(savedCourse);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(@RequestParam(required = false) String userId) {
        try {
            if (userId != null) {
                return ResponseEntity.ok(courseService.getCoursesByUserId(userId));
            }
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @Valid @RequestBody Course updatedCourse, Authentication auth) {
        try {
            Optional<Course> existingCourse = courseService.getCourseById(id);
            if (existingCourse.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            String userEmail = auth.getName(); // Extract email from JWT
            if (!existingCourse.get().getUserId().equals(userEmail)) {
                return ResponseEntity.status(403).body(null); // Unauthorized
            }
            updatedCourse.setUserId(userEmail); // Ensure userId remains email
            Course savedCourse = courseService.updateCourse(id, updatedCourse);
            return ResponseEntity.ok(savedCourse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id, Authentication auth) {
        try {
            Optional<Course> course = courseService.getCourseById(id);
            if (course.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            String userEmail = auth.getName(); // Extract email from JWT
            if (!course.get().getUserId().equals(userEmail)) {
                return ResponseEntity.status(403).build(); // Unauthorized
            }
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}