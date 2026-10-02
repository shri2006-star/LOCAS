package com.locas.controller;

import com.locas.dto.request.LoginRequest;
import com.locas.dto.request.RegisterRequest;
import com.locas.dto.response.ApiResponse;
import com.locas.dto.response.AuthResponse;
import com.locas.dto.response.UserResponse;
import com.locas.security.UserPrincipal;
import com.locas.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration, authentication and JWT token handling APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register User", description = "Create a new user account (Applicant, Credit Officer, etc.)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user credentials and generate JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Current User Profile", description = "Get authenticated user details")
    public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse user = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success(user, "User details retrieved"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout User", description = "Invalidate token session")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
