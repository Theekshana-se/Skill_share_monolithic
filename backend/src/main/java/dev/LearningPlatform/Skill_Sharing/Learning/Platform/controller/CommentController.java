package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Comment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:8081")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<Comment> listComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/{id}/replies")
    public List<Comment> listReplies(@PathVariable String id) {
        return commentService.getReplies(id);
    }

    @GetMapping("/count")
    public long countComments() {
        return commentService.count();
    }

    @GetMapping("/{id}/replies/count")
    public long countReplies(@PathVariable String id) {
        return commentService.countReplies(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getOne(@PathVariable String id) {
        return commentService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Comment> create(@RequestBody Comment comment) {
        if (comment.isReply()) {
            Comment parent = commentService.getById(comment.getReplyTo()).orElse(null);
            if (parent == null) {
                return ResponseEntity.badRequest().build();
            }
        }
        Comment saved = commentService.create(comment);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> update(@PathVariable String id, @RequestBody Comment details) {
        try {
            System.out.println("Debug - Attempting to update comment: " + id);
            Comment updated = commentService.updateComment(id, details.getContent());
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Debug - Unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Comment> likeComment(@PathVariable String id) {
        Comment updated = commentService.likeComment(id);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/dislike")
    public ResponseEntity<Comment> dislikeComment(@PathVariable String id) {
        Comment updated = commentService.dislikeComment(id);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<Comment> replyToComment(@PathVariable String id, @RequestBody Comment reply) {
        Comment parent = commentService.getById(id).orElse(null);
        if (parent == null) {
            return ResponseEntity.notFound().build();
        }
        reply.setReply(true);
        reply.setReplyTo(id);
        Comment savedReply = commentService.create(reply);
        return ResponseEntity.status(201).body(savedReply);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}