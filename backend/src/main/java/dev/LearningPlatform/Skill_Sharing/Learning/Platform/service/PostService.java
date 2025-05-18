package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    
    @Value("${upload.path:/uploads}")
    private String uploadPath;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);
            post.setImageUrl("/uploads/" + fileName);
        }
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUserEmail(String userEmail) {
        return postRepository.findByUserEmail(userEmail);
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post updatePost(String id, Post updatedPost, MultipartFile image) throws IOException {
        Optional<Post> existingPostOpt = postRepository.findById(id);
        if (existingPostOpt.isPresent()) {
            Post existingPost = existingPostOpt.get();
            existingPost.setTitle(updatedPost.getTitle());
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setSlogan(updatedPost.getSlogan());
            existingPost.setUpdatedAt(updatedPost.getUpdatedAt());

            if (image != null && !image.isEmpty()) {
                // Delete old image if exists
                if (existingPost.getImageUrl() != null) {
                    Path oldImagePath = Paths.get(uploadPath, existingPost.getImageUrl().substring("/uploads/".length()));
                    Files.deleteIfExists(oldImagePath);
                }

                // Save new image
                String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(image.getInputStream(), filePath);
                existingPost.setImageUrl("/uploads/" + fileName);
            }

            return postRepository.save(existingPost);
        } else {
            throw new IllegalArgumentException("Post not found");
        }
    }

    public void deletePost(String id) throws IOException {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent() && post.get().getImageUrl() != null) {
            Path imagePath = Paths.get(uploadPath, post.get().getImageUrl().substring("/uploads/".length()));
            Files.deleteIfExists(imagePath);
        }
        postRepository.deleteById(id);
    }
}
