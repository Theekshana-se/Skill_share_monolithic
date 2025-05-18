package dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enroll;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnrollRepository extends MongoRepository<Enroll, String> {
}
