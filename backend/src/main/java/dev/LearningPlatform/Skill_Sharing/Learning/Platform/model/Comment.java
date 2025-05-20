package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId;
    private String content;

    @JsonProperty("userEmail") // Ensure the field is serialized as "userEmail"
    private String userEmail;

    private Instant createdAt;
    private Instant updatedAt;
    private int likes;
    private int dislikes;
    private String authorName;
    private String avatarUrl;
    private boolean reply;
    private String replyTo;

    public Comment() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.likes = 0;
        this.dislikes = 0;
    }

    public Comment(String postId, String authorName, String avatarUrl, String content, String userEmail) {
        this();
        this.postId = postId;
        this.authorName = authorName;
        this.avatarUrl = avatarUrl;
        this.content = content;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isReply() {
        return reply;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReply(boolean reply) {
        this.reply = reply;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }
}