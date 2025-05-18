package dev.LearningPlatform.Skill_Sharing.Learning.Platform.config;

import dev.LearningPlatform.Skill_Sharing.Learning.Platform.security.MongoUserDetailsService;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.security.JwtAuthenticationFilter;
import dev.LearningPlatform.Skill_Sharing.Learning.Platform.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final MongoUserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, MongoUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // --- 1) Define CORS policy ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:8081")); // Updated to frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // --- 2) Security filter chain ---
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil, userDetailsService);

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless sessions
                .authorizeHttpRequests(auth -> auth
                        // Allow public endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Preflight requests
                        .requestMatchers("/api/auth/login").permitAll() // Login endpoint
                        .requestMatchers(HttpMethod.GET, "/api/users").permitAll() // User registration
                        .requestMatchers(HttpMethod.GET, "/api/users/files/**").permitAll() // Serve user files
                        .requestMatchers(HttpMethod.GET, "/api/users/images/**").permitAll()
                        .requestMatchers("/api/posts/**").permitAll() // Public posts
                        .requestMatchers(HttpMethod.POST, "/api/enrollments").permitAll()
                        .requestMatchers("/api/courses/**").permitAll() // Allow all requests to /api/courses
                        .requestMatchers("/error").permitAll() // Spring Boot error path
                        .requestMatchers("/api/comments/**").permitAll() // Public comments
                        .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                        // Secure all other endpoints
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }

    // --- 3) Expose AuthenticationManager for login ---
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // --- 4) Password encoder ---
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}