package dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
    // Additional query methods if needed
}
