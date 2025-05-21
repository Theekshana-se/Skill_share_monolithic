package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Course;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.CourseRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private static final int MAX_THUMBNAIL_SIZE = 1024 * 1024; // 1MB limit

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validateProgress(course.getProgress());
        course.setThumbnail(validateThumbnail(course.getThumbnail()));
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            course.setUserId(auth.getName());
        }
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public Course updateCourse(String id, Course updatedCourse) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course course = existingCourse.get();
            course.setCourseName(updatedCourse.getCourseName());
            course.setCourseLevel(updatedCourse.getCourseLevel());
            course.setInstitute(updatedCourse.getInstitute());
            course.setStartDate(updatedCourse.getStartDate());
            course.setDuration(updatedCourse.getDuration());
            course.setCourseType(updatedCourse.getCourseType());
            validateProgress(updatedCourse.getProgress());
            course.setProgress(updatedCourse.getProgress());
            course.setModules(updatedCourse.getModules());
            course.setThumbnail(validateThumbnail(updatedCourse.getThumbnail()));
            return courseRepository.save(course);
        } else {
            throw new IllegalArgumentException("Course not found with ID: " + id);
        }
    }

    public void deleteCourse(String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Course not found with ID: " + id);
        }
    }

    public List<Course> getCoursesByUserId(String userId) {
        return courseRepository.findByUserId(userId);
    }

    private void validateProgress(int progress) {
        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100.");
        }
    }

    private String validateThumbnail(String thumbnail) {
        if (thumbnail != null && !thumbnail.isEmpty()) {
            // Check if it's a valid base64 string
            if (!thumbnail.startsWith("data:image/")) {
                throw new IllegalArgumentException("Invalid thumbnail format. Must be a base64 encoded image.");
            }
            
            // Remove the data URL prefix to get the actual base64 string
            String base64Data = thumbnail.split(",")[1];
            
            // Calculate the size of the base64 string
            int size = (int) (base64Data.length() * 0.75); // Base64 size calculation
            
            if (size > MAX_THUMBNAIL_SIZE) {
                throw new IllegalArgumentException("Thumbnail size exceeds the maximum limit of 1MB.");
            }

            // Return the complete base64 string including the data URL prefix
            return thumbnail;
        }
        return null;
    }
}