package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Course;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.CourseRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validateProgress(course.getProgress());
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
}