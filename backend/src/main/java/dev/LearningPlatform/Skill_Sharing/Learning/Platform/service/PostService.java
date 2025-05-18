package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Post;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existingPostOpt = postRepository.findById(id);
        if (existingPostOpt.isPresent()) {
            Post existingPost = existingPostOpt.get();
            existingPost.setTitle(updatedPost.getTitle());
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setSlogan(updatedPost.getSlogan());
            return postRepository.save(existingPost);
        } else {
            throw new IllegalArgumentException("Post not found");
        }
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
