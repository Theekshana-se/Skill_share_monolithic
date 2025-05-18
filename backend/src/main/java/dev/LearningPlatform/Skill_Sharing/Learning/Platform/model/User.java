package dev.LearningPlatform.Skill_Sharing.Learning.Platform.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String username;

    @Indexed(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private int age;

    private String location;
    private String bio;
    private String profilePhotoBase64; // Base64-encoded profile photo
    private String coverPhotoBase64;   // Base64-encoded cover photo

    // Roles for Spring Security
    private List<String> roles;

    // Default constructor
    public User() {}

    // Constructor without roles: defaults to ROLE_USER
    public User(String name, String username, String email, String password,
                int age, String location, String bio) {
        this(name, username, email, password, age, location, bio, List.of("ROLE_USER"));
    }

    // Full constructor
    public User(String name, String username, String email, String password,
                int age, String location, String bio, List<String> roles) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.location = location;
        this.bio = bio;
        this.roles = roles;
    }

    // Getters & Setters
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePhotoBase64() {
        return profilePhotoBase64;
    }

    public void setProfilePhotoBase64(String profilePhotoBase64) {
        this.profilePhotoBase64 = profilePhotoBase64;
    }

    public String getCoverPhotoBase64() {
        return coverPhotoBase64;
    }

    public void setCoverPhotoBase64(String coverPhotoBase64) {
        this.coverPhotoBase64 = coverPhotoBase64;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}