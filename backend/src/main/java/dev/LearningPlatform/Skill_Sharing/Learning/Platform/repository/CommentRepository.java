package dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    // Get all top-level comments (not replies), newest first
    List<Comment> findByReplyFalseOrderByCreatedAtDesc();

    // Get replies for a given comment ID, oldest first
    List<Comment> findByReplyTrueAndReplyToOrderByCreatedAtAsc(String replyTo);

    // Count the number of replies for a specific parent comment
    long countByReplyTo(String replyTo);


    // new: fetch only top-level comments for one post, newest first
    List<Comment> findByPostIdAndReplyFalseOrderByCreatedAtDesc(String postId);

    // Optional future extensions — examples:
    // List<Comment> findByAuthor(String author);
    // List<Comment> findByVerifiedTrueOrderByCreatedAtDesc();
}
