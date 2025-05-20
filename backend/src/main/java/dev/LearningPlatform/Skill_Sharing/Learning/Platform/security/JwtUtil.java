package dev.LearningPlatform.Skill_Sharing.Learning.Platform.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Build a secure HS256 key (must be ≥256 bits)
    private Key getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            logger.error("Error creating signing key: {}", e.getMessage());
            throw e;
        }
    }

    public String generateToken(String username) {
        try {
            Date now = new Date();
            Date expiry = new Date(now.getTime() + expirationMs);

            String token = Jwts.builder()
                       .setSubject(username)
                       .setIssuedAt(now)
                       .setExpiration(expiry)
                       .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                       .compact();
            
            logger.debug("Generated token for user: {}, expires: {}", username, expiry);
            return token;
        } catch (Exception e) {
            logger.error("Error generating token for user {}: {}", username, e.getMessage());
            throw e;
        }
    }

    public String validateAndGetUsername(String token) {
        try {
            logger.debug("Validating token...");
            Jws<Claims> claims = Jwts.parserBuilder()
                                     .setSigningKey(getSigningKey())
                                     .build()
                                     .parseClaimsJws(token);
            
            String username = claims.getBody().getSubject();
            Date expiration = claims.getBody().getExpiration();
            
            logger.debug("Token validated successfully for user: {}, expires: {}", username, expiration);
            return username;
        } catch (ExpiredJwtException e) {
            logger.error("Token expired: {}", e.getMessage());
            throw new JwtException("Token has expired", e);
        } catch (SignatureException e) {
            logger.error("Invalid token signature: {}", e.getMessage());
            throw new JwtException("Invalid token signature", e);
        } catch (MalformedJwtException e) {
            logger.error("Malformed token: {}", e.getMessage());
            throw new JwtException("Malformed token", e);
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Token validation failed: {}", e.getMessage());
            throw new JwtException("Invalid or expired JWT token", e);
        }
    }
}
