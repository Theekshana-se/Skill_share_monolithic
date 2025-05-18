package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Course level is required")
    private String courseLevel;

    @NotBlank(message = "Institute is required")
    private String institute;

    private LocalDate startDate;

    private int duration;

    @NotBlank(message = "Course type is required")
    private String courseType;

    private int progress;

    private String userId;

    private List<Module> modules;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getCourseLevel() { return courseLevel; }
    public void setCourseLevel(String courseLevel) { this.courseLevel = courseLevel; }
    public String getInstitute() { return institute; }
    public void setInstitute(String institute) { this.institute = institute; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<Module> getModules() { return modules; }
    public void setModules(List<Module> modules) { this.modules = modules; }
}