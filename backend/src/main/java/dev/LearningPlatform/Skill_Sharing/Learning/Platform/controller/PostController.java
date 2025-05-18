package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam @Valid String title,
            @RequestParam @Valid String description,
            @RequestParam @Valid String slogan) {
        try {
            Post post = new Post();
            post.setTitle(title);
            post.setDescription(description);
            post.setSlogan(slogan);
            Post savedPost = postService.createPost(post);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
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
            @RequestParam String slogan) {
        try {
            Post updatedPost = new Post();
            updatedPost.setTitle(title);
            updatedPost.setDescription(description);
            updatedPost.setSlogan(slogan);
            Post savedPost = postService.updatePost(id, updatedPost);
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
