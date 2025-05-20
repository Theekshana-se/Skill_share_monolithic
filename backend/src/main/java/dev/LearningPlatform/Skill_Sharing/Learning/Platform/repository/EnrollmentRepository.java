package dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    Optional<Enrollment> findByUserEmailAndCourseId(String userEmail, String courseId);
    List<Enrollment> findByUserEmail(String userEmail);
    List<Enrollment> findByCourseId(String courseId);

    static boolean existsByUserEmailAndCourseId(String userEmail, String courseId) {
        return false;
    }
} 