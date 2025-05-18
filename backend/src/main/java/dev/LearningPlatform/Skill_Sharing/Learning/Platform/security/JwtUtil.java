package dev.LearningPlatform.Skill_Sharing.Learning.Platform.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Build a secure HS256 key (must be ≥256 bits)
    private Key getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
}

    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                   .setSubject(username)
                   .setIssuedAt(now)
                   .setExpiration(expiry)
                   .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                   .compact();
    }

    public String validateAndGetUsername(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                                     .setSigningKey(getSigningKey())
                                     .build()
                                     .parseClaimsJws(token);
            return claims.getBody().getSubject();
        } catch (JwtException | IllegalArgumentException ex) {
            // rethrow or wrap if you want a custom exception type
            throw new JwtException("Invalid or expired JWT token", ex);
        }
    }
}
