package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Comment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        List<Comment> comments = commentRepository.findByReplyFalseOrderByCreatedAtDesc();
        System.out.println("Returning all comments: " + comments);
        return comments;
    }

    public List<Comment> getReplies(String parentId) {
        List<Comment> replies = commentRepository.findByReplyTrueAndReplyToOrderByCreatedAtAsc(parentId);
        System.out.println("Returning replies for parentId " + parentId + ": " + replies);
        return replies;
    }

    public long count() {
        return commentRepository.count();
    }

    public long countReplies(String parentId) {
        return commentRepository.countByReplyTo(parentId);
    }

    public Optional<Comment> getById(String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        System.out.println("Returning comment by ID " + id + ": " + comment.orElse(null));
        return comment;
    }

    public Comment create(Comment comment) {
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());
        Comment saved = commentRepository.save(comment);
        System.out.println("Created comment: " + saved);
        return saved;
    }

    public Comment update(String id, Comment newDetails) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) {
            return null;
        }

        Comment comment = optionalComment.get();
        String currentUserEmail = getCurrentUserEmail();
        System.out.println("Updating comment ID: " + id + ", Comment userEmail: " + comment.getUserEmail() + ", Current user email: " + currentUserEmail);
        if (!comment.getUserEmail().equals(currentUserEmail)) {
            throw new SecurityException("You are not authorized to update this comment");
        }

        comment.setContent(newDetails.getContent());
        comment.setLikes(newDetails.getLikes());
        comment.setDislikes(newDetails.getDislikes());
        comment.setUpdatedAt(Instant.now());
        return commentRepository.save(comment);
    }

    public void delete(String id) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }

        Comment comment = optionalComment.get();
        String currentUserEmail = getCurrentUserEmail();
        System.out.println("Deleting comment ID: " + id + ", Comment userEmail: " + comment.getUserEmail() + ", Current user email: " + currentUserEmail);
        if (!comment.getUserEmail().equals(currentUserEmail)) {
            throw new SecurityException("You are not authorized to delete this comment");
        }

        commentRepository.deleteById(id);
    }

    public Comment likeComment(String id) {
        return commentRepository.findById(id)
                .map(comment -> {
            comment.setLikes(comment.getLikes() + 1);
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public Comment dislikeComment(String id) {
        return commentRepository.findById(id)
                .map(comment -> {
            comment.setDislikes(comment.getDislikes() + 1);
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public Comment replyToComment(String parentId, Comment reply) {
        Optional<Comment> parent = commentRepository.findById(parentId);
        if (parent.isPresent()) {
            reply.setReply(true);
            reply.setReplyTo(parentId);
            return commentRepository.save(reply);
        }
        return null;
    }

    public List<Comment> getCommentsForPost(String postId) {
        List<Comment> comments = commentRepository.findByPostIdAndReplyFalseOrderByCreatedAtDesc(postId);
        System.out.println("Returning comments for postId " + postId + ": " + comments);
        return comments;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        System.out.println("Returning comments by postId " + postId + ": " + comments);
        return comments;
    }

    public Optional<Comment> getCommentById(String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        System.out.println("Returning comment by ID " + id + ": " + comment.orElse(null));
        return comment;
    }

    public Comment updateComment(String id, String content) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }

        Comment comment = optionalComment.get();
        System.out.println("Debug - Update Comment:");
        System.out.println("Comment ID: " + id);
        System.out.println("New content: " + content);

        comment.setContent(content);
        comment.setUpdatedAt(Instant.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String id) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }

        System.out.println("Debug - Delete Comment:");
        System.out.println("Comment ID: " + id);

        commentRepository.deleteById(id);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            System.out.println("No authentication context found");
            throw new SecurityException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        String email = null;

        if (principal instanceof OAuth2User) {
            OAuth2User oAuth2User = (OAuth2User) principal;
            email = oAuth2User.getAttribute("email");
            System.out.println("Current user email from OAuth2User: " + email);
        } else if (principal instanceof String) {
            email = (String) principal;
            System.out.println("Current user email from principal: " + email);
        }

        if (email == null) {
            System.out.println("No email found in authentication");
            throw new SecurityException("No email found in authentication");
        }

        return email.trim().toLowerCase();
    }
}