package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class Module {
    private String id;

    @NotBlank(message = "Module title is required")
    private String title;

    private String description;
    private List<Lesson> lessons;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Lesson> getLessons() { return lessons; }
    public void setLessons(List<Lesson> lessons) { this.lessons = lessons; }
}