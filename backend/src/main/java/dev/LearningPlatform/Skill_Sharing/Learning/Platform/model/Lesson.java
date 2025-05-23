package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import jakarta.validation.constraints.NotBlank;

public class Lesson {
    private String id;

    @NotBlank(message = "Lesson title is required")
    private String title;

    private String content;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}