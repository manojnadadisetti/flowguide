package com.flowguide.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Component
public class JwtFilter implements Filter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        
        // Skip filter for non-API routes or actuator
        if (!path.startsWith("/api/")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\": \"Unauthorized - Missing JWT Token\"}");
            return;
        }

        String token = authHeader.substring(7);
        try {
            // Decode JWT payload (Base64 decoded second segment of JWT Header.Payload.Signature)
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid JWT token format");
            }
            
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
            @SuppressWarnings("unchecked")
            Map<String, Object> claims = objectMapper.readValue(payloadJson, Map.class);
            
            String email = (String) claims.get("email");
            String role = (String) claims.get("role");

            if (email == null || role == null) {
                throw new IllegalArgumentException("Token missing email or role claims");
            }

            // Bind claims to request attributes
            httpRequest.setAttribute("userEmail", email);
            httpRequest.setAttribute("userRole", role);

            // Role-Based Access Control (RBAC): restrict admin actions
            if (path.startsWith("/api/admin/") && !"admin".equalsIgnoreCase(role)) {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.getWriter().write("{\"error\": \"Forbidden - Admin role required\"}");
                return;
            }

            chain.doFilter(request, response);

        } catch (Exception e) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\": \"Unauthorized - Invalid JWT Token: " + e.getMessage() + "\"}");
        }
    }

    @Override
    public void destroy() {}
}
