package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.User;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Create new user
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(
            @RequestParam String name,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam int age,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profilePhoto,
            @RequestParam(required = false) MultipartFile coverPhoto
    ) {
        try {
            User user = new User(name, username, email, password, age, location, bio);

            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                user.setProfilePhotoBase64(convertToBase64(profilePhoto));
            }

            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                user.setCoverPhotoBase64(convertToBase64(coverPhoto));
            }

            User createdUser = userService.createUser(user);

            return ResponseEntity.created(
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(createdUser.getId())
                            .toUri()
            ).body(createdUser);

        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
        }
    }

    // Update user
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profilePhoto,
            @RequestParam(required = false) MultipartFile coverPhoto
    ) {
        try {
            User user = new User();
            if (name != null) user.setName(name);
            if (username != null) user.setUsername(username);
            if (email != null) user.setEmail(email);
            if (password != null) user.setPassword(password);
            if (age != null) user.setAge(age);
            if (location != null) user.setLocation(location);
            if (bio != null) user.setBio(bio);

            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                user.setProfilePhotoBase64(convertToBase64(profilePhoto));
            }

            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                user.setCoverPhotoBase64(convertToBase64(coverPhoto));
            }

            User updatedUser = userService.updateUser(id, user);
            return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();

        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Serve Base64 image as binary
    @GetMapping("/images/{id}/{type}")
    public ResponseEntity<?> serveImage(@PathVariable String id, @PathVariable String type) {
        return userService.getUserById(id)
                .map(user -> {
                    String base64Image = "profile".equals(type) ? user.getProfilePhotoBase64() : user.getCoverPhotoBase64();
                    if (base64Image == null) {
                        return ResponseEntity.notFound().build();
                    }
                    try {
                        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                        String mimeType = "image/" + (base64Image.startsWith("/9j/") ? "jpeg" : "png"); // Basic MIME type detection
                        return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(mimeType))
                                .body(imageBytes);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Utility method to convert MultipartFile to Base64
    private String convertToBase64(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        return Base64.getEncoder().encodeToString(fileBytes);
    }
}