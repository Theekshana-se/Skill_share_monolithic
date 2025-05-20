package dev.LearningPlatform.Skill_Sharing.Learning.Platform.service;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.User;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateKeyException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(List.of("ROLE_USER"));
        }
        return userRepository.save(user);
    }

    public User updateUser(String id, User details) {
        return userRepository.findById(id)
                .map(user -> {
                    if (details.getEmail() != null && !user.getEmail().equals(details.getEmail())) {
                        if (userRepository.findByEmail(details.getEmail()).isPresent()) {
                            throw new DuplicateKeyException("Email already exists");
                        }
                        user.setEmail(details.getEmail());
                    }
                    if (details.getName() != null) user.setName(details.getName());
                    if (details.getUsername() != null) user.setUsername(details.getUsername());
                    if (details.getAge() != 0) user.setAge(details.getAge());
                    if (details.getLocation() != null) user.setLocation(details.getLocation());
                    if (details.getBio() != null) user.setBio(details.getBio());
                    if (details.getProfilePhotoBase64() != null) user.setProfilePhotoBase64(details.getProfilePhotoBase64());
                    if (details.getCoverPhotoBase64() != null) user.setCoverPhotoBase64(details.getCoverPhotoBase64());
                    if (details.getPassword() != null && !details.getPassword().isBlank()) {
                        user.setPassword(passwordEncoder.encode(details.getPassword()));
                    }
                    if (details.getRoles() != null && !details.getRoles().isEmpty()) {
                        user.setRoles(details.getRoles());
                    }
                    return userRepository.save(user);
                }).orElse(null);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}