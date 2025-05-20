package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.Base64;
import java.io.IOException;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"}, allowCredentials = "true")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam @Valid String title,
            @RequestParam @Valid String description,
            @RequestParam @Valid String slogan,
            @RequestParam @Valid String userEmail,
            @RequestParam(required = false) MultipartFile image) {
        try {
            Post post = new Post();
            post.setTitle(title);
            post.setDescription(description);
            post.setSlogan(slogan);
            post.setUserEmail(userEmail);
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());

            if (image != null && !image.isEmpty()) {
                // Convert image to base64 without any prefix
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                post.setImageBase64(base64Image);
            }
            
            Post savedPost = postService.createPost(post, null);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(
            @RequestParam(required = false) String userEmail) {
        List<Post> posts;
        if (userEmail != null && !userEmail.isEmpty()) {
            posts = postService.getPostsByUserEmail(userEmail);
        } else {
            posts = postService.getAllPosts();
        }
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String slogan,
            @RequestParam(required = false) MultipartFile image) {
        try {
            Optional<Post> existingPost = postService.getPostById(id);
            if (existingPost.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Post updatedPost = existingPost.get();
            updatedPost.setTitle(title);
            updatedPost.setDescription(description);
            updatedPost.setSlogan(slogan);
            updatedPost.setUpdatedAt(LocalDateTime.now());

            if (image != null && !image.isEmpty()) {
                // Convert image to base64 without any prefix
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                updatedPost.setImageBase64(base64Image);
            }
            
            Post savedPost = postService.updatePost(id, updatedPost, null);
            return ResponseEntity.ok(savedPost);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
