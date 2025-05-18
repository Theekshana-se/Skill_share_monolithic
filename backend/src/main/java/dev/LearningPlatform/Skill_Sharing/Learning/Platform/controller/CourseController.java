package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Course;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.CourseService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
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
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @Valid @RequestBody Course updatedCourse) {
        try {
            Course savedCourse = courseService.updateCourse(id, updatedCourse);
            return ResponseEntity.ok(savedCourse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}