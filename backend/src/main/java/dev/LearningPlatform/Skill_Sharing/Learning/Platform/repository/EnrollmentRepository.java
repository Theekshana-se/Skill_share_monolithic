package dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    @Query(value = "{ 'userEmail': ?0, 'courseId': ?1 }", fields = "{ 'id': 1, 'userEmail': 1, 'courseId': 1, 'progress': 1, 'completedLessonIds': 1 }")
    Optional<Enrollment> findByUserEmailAndCourseId(String userEmail, String courseId);

    @Query(value = "{ 'userEmail': ?0 }", fields = "{ 'id': 1, 'userEmail': 1, 'courseId': 1, 'progress': 1, 'completedLessonIds': 1 }")
    List<Enrollment> findByUserEmail(String userEmail);

    @Query(value = "{ 'userEmail': ?0, 'courseId': ?1 }", exists = true)
    boolean existsByUserEmailAndCourseId(String userEmail, String courseId);

    // Add a count query for debugging
    @Query(value = "{ 'userEmail': ?0, 'courseId': ?1 }", count = true)
    long countByUserEmailAndCourseId(String userEmail, String courseId);
} 