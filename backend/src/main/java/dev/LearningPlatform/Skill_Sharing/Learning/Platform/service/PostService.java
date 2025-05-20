package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post, MultipartFile image) throws IOException {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
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
            existingPost.setImageBase64(updatedPost.getImageBase64());
            return postRepository.save(existingPost);
        } else {
            throw new IllegalArgumentException("Post not found");
        }
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
