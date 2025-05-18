package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.Enroll;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.EnrollRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollService {

    private final EnrollRepository enrollRepository;

    public EnrollService(EnrollRepository enrollRepository) {
        this.enrollRepository = enrollRepository;
    }

    public Enroll createEnrollment(Enroll enroll) {
        return enrollRepository.save(enroll);
    }

    public List<Enroll> getAllEnrollments() {
        return enrollRepository.findAll();
    }

    public Optional<Enroll> getEnrollmentById(String id) {
        return enrollRepository.findById(id);
    }

    public Enroll updateEnrollment(String id, Enroll updatedEnroll) {
        Optional<Enroll> existingEnroll = enrollRepository.findById(id);
        if (existingEnroll.isPresent()) {
            Enroll enroll = existingEnroll.get();
            enroll.setName(updatedEnroll.getName());
            enroll.setModuleKey(updatedEnroll.getModuleKey());
            return enrollRepository.save(enroll);
        } else {
            throw new IllegalArgumentException("Enrollment not found with ID: " + id);
        }
    }

    public void deleteEnrollment(String id) {
        if (enrollRepository.existsById(id)) {
            enrollRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Enrollment not found with ID: " + id);
        }
    }
}
