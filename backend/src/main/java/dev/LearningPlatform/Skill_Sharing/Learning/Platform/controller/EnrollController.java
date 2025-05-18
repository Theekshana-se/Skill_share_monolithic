package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enroll;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.EnrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollController {

    private final EnrollService enrollService;

    public EnrollController(EnrollService enrollService) {
        this.enrollService = enrollService;
    }

    @PostMapping
    public ResponseEntity<Enroll> createEnrollment(@Valid @RequestBody Enroll enroll) {
        Enroll savedEnroll = enrollService.createEnrollment(enroll);
        return ResponseEntity.ok(savedEnroll);
    }

    @GetMapping
    public ResponseEntity<List<Enroll>> getAllEnrollments() {
        List<Enroll> enrollments = enrollService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enroll> getEnrollmentById(@PathVariable String id) {
        Optional<Enroll> enroll = enrollService.getEnrollmentById(id);
        return enroll.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enroll> updateEnrollment(@PathVariable String id, @Valid @RequestBody Enroll updatedEnroll) {
        try {
            Enroll savedEnroll = enrollService.updateEnrollment(id, updatedEnroll);
            return ResponseEntity.ok(savedEnroll);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable String id) {
        try {
            enrollService.deleteEnrollment(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
