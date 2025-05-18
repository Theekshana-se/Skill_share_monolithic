package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Comment;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:8081")
public class CommentController {

    @Autowired
    private CommentService svc;

    // Get all top-level comments
    @GetMapping
    public List<Comment> listComments() {
        return svc.getAllComments();
    }

    // Get replies to a parent comment
    @GetMapping("/{id}/replies")
    public List<Comment> listReplies(@PathVariable String id) {
        return svc.getReplies(id);
    }

    // Get total comment count
    @GetMapping("/count")
    public long countComments() {
        return svc.count();
    }

    // Get total replies count for a specific parent comment
    @GetMapping("/{id}/replies/count")
    public long countReplies(@PathVariable String id) {
        return svc.countReplies(id);
    }

    // Get single comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getOne(@PathVariable String id) {
        return svc.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new comment or reply
    @PostMapping
    public ResponseEntity<Comment> create(@RequestBody Comment comment) {
        // If the comment is a reply, ensure the parent comment exists
        if (comment.isReply()) {
            Comment parent = svc.getById(comment.getReplyTo()).orElse(null);
            if (parent == null) {
                return ResponseEntity.badRequest().build(); // Parent comment not found
            }
        }
        Comment saved = svc.create(comment);
        return ResponseEntity.status(201).body(saved);
    }

    // Update comment (edit content, like/dislike counts, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<Comment> update(@PathVariable String id, @RequestBody Comment details) {
        Comment updated = svc.update(id, details);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Like a comment
    @PutMapping("/{id}/like")
    public ResponseEntity<Comment> likeComment(@PathVariable String id) {
        Comment updated = svc.likeComment(id);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    // Dislike a comment
    @PutMapping("/{id}/dislike")
    public ResponseEntity<Comment> dislikeComment(@PathVariable String id) {
        Comment updated = svc.dislikeComment(id);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    // Reply to a comment
    @PostMapping("/{id}/reply")
    public ResponseEntity<Comment> replyToComment(@PathVariable String id, @RequestBody Comment reply) {
        // Ensure the parent comment exists
        Comment parent = svc.getById(id).orElse(null);
        if (parent == null) {
            return ResponseEntity.notFound().build(); // Parent comment not found
        }

        // Create the reply and link it to the parent comment
        reply.setReply(true); // Mark as a reply
        reply.setReplyTo(id); // Set the parent comment ID

        Comment savedReply = svc.create(reply);
        return ResponseEntity.status(201).body(savedReply);
    }

    // GET /api/comments/post/{postId}
    @GetMapping("/post/{postId}")
        public List<Comment> listCommentsByPost(@PathVariable String postId) {
        return svc.getCommentsForPost(postId);
    }

}
