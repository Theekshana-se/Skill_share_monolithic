package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "enrollments")
public class Enrollment {
    @Id
    private String id;
    private String userEmail;
    private String courseId;
    private Set<String> completedLessonIds;
    private int progress;

    public Enrollment() {
        this.completedLessonIds = new HashSet<>();
        this.progress = 0;
    }

    public Enrollment(String userEmail, String courseId) {
        this();
        this.userEmail = userEmail;
        this.courseId = courseId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Set<String> getCompletedLessonIds() {
        return completedLessonIds;
    }

    public void setCompletedLessonIds(Set<String> completedLessonIds) {
        this.completedLessonIds = completedLessonIds;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public void addCompletedLesson(String lessonId) {
        this.completedLessonIds.add(lessonId);
    }

    public void removeCompletedLesson(String lessonId) {
        this.completedLessonIds.remove(lessonId);
    }
} 