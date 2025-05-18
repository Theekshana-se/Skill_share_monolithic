package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Comment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    // All top‐level comments
    public List<Comment> getAllComments() {
        return commentRepo.findByReplyFalseOrderByCreatedAtDesc();
    }

    // Replies to a single comment
    public List<Comment> getReplies(String parentId) {
        return commentRepo.findByReplyTrueAndReplyToOrderByCreatedAtAsc(parentId);
    }

    // Get total count of comments
    public long count() {
        return commentRepo.count();
    }

    // Get total count of replies for a specific parent comment
    public long countReplies(String parentId) {
        return commentRepo.countByReplyTo(parentId);
    }

    // Get comment by ID
    public Optional<Comment> getById(String id) {
        return commentRepo.findById(id);
    }

    // Create new comment or reply
    public Comment create(Comment comment) {
        return commentRepo.save(comment);
    }

    // Update comment (edit content, like/dislike counts, etc.)
    public Comment update(String id, Comment newDetails) {
        return commentRepo.findById(id).map(c -> {
            c.setContent(newDetails.getContent());
            c.setLikes(newDetails.getLikes());
            c.setDislikes(newDetails.getDislikes());
            // Extend with more fields if needed
            return commentRepo.save(c);
        }).orElse(null);
    }

    // Delete a comment
    public void delete(String id) {
        commentRepo.deleteById(id);
    }

    // Like a comment (top-level or reply)
    public Comment likeComment(String id) {
        Optional<Comment> commentOpt = commentRepo.findById(id);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setLikes(comment.getLikes() + 1);
            return commentRepo.save(comment);
        }
        return null;
    }

    // Dislike a comment (top-level or reply)
    public Comment dislikeComment(String id) {
        Optional<Comment> commentOpt = commentRepo.findById(id);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setDislikes(comment.getDislikes() + 1);
            return commentRepo.save(comment);
        }
        return null;
    }

    // Reply to a comment
    public Comment replyToComment(String parentId, Comment reply) {
        Optional<Comment> parent = commentRepo.findById(parentId);
        if (parent.isPresent()) {
            reply.setReply(true); // Mark as a reply
            reply.setReplyTo(parentId); // Set parent comment's ID
            return commentRepo.save(reply);
        }
        return null;
    }

    public List<Comment> getCommentsForPost(String postId) {
        return commentRepo.findByPostIdAndReplyFalseOrderByCreatedAtDesc(postId);
    }

    
      
}
