package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId;   
    private String author;
    private String avatarUrl;
    private Instant createdAt;
    private String content;
    private int likes;
    private int dislikes;
    private boolean verified;
    private boolean reply;
    private String replyTo; // This stores the parent comment ID for replies

    // Default constructor
    public Comment() {
        this.createdAt = Instant.now();
        this.likes = 0;
        this.dislikes = 0;
    }

    // Constructor for initial comment
    public Comment(String postId, String author, String avatarUrl, String content, boolean verified) {
        this();
        this.postId = postId;
        this.author = author;
        this.avatarUrl = avatarUrl;
        this.content = content;
        this.verified = verified;
        this.reply = false; // Top-level comment (not a reply)
        this.replyTo = null; // No parent for top-level comments
    }

    // Constructor for replies
    public Comment(String postId,String author, String avatarUrl, String content, boolean verified, String replyTo) {
        this(postId, author, avatarUrl, content, verified);
        this.reply = true;
        this.replyTo = replyTo; // Set parent comment ID for the reply
    }

    // Getters & Setters

    public String getPostId() { return postId; }

    public void setPostId(String postId) { this.postId = postId; }
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isReply() {
        return reply;
    }

    public void setReply(boolean reply) {
        this.reply = reply;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    // Helper method to determine if this comment is a reply
    public boolean isTopLevelComment() {
        return !this.reply;
    }
}
