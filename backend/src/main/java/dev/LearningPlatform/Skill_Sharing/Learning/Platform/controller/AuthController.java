package dev.LearningPlatform.Skill_Sharing.Learning.Platform.controller;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.model.User;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.repository.UserRepository;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.security.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {
    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        String token = Jwts.builder()
                .setSubject(email)
                .claim("roles", user.getRoles())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(SignatureAlgorithm.HS512, "G03eCwTVW2XtKSP38S6o0yYrF3PRsqU+dqgNkRtkm9YPvOekYZ4hJkpEU6QFNNRfJKsRYEdfSkUIFWYF8uzHEQ==")
                .compact();
        return ResponseEntity.ok(Map.of("token", token, "user", user));
    }
}

