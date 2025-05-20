package dev.LearningPlatform.Skill_Sharing.Learning.Platform.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.getUsername());

        // Create user data map
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", userDetails.getId());
        userData.put("email", userDetails.getUsername());
        userData.put("name", userDetails.getName());

        // Convert user data to JSON string and encode for URL
        String userDataJson = objectMapper.writeValueAsString(userData);
        String encodedUserData = URLEncoder.encode(userDataJson, StandardCharsets.UTF_8);

        // Create the redirect URL with both token and user data
        String redirectUrl = String.format("%s/oauth2/callback?token=%s&userData=%s",
                frontendUrl, token, encodedUserData);

        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", frontendUrl);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Redirect to the frontend
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
} 