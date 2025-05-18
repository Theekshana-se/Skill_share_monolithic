package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "enrollments")
public class Enroll {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Module key is required")
    private String moduleKey;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModuleKey() {
        return moduleKey;
    }

    public void setModuleKey(String moduleKey) {
        this.moduleKey = moduleKey;
    }
}
