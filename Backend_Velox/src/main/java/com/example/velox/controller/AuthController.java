package com.example.velox.controller;

import com.example.velox.dto.AuthResponseDTO;
import com.example.velox.dto.LoginDTO;
import com.example.velox.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // La ruta base que configuramos en SecurityConfig
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint para hacer Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.login(loginDTO);
            return ResponseEntity.ok(response); // Retorna 200 OK y el Token
        } catch (RuntimeException e) {
            // Retorna 401 Unauthorized si la contraseña o email fallan
            return ResponseEntity.status(401).body(null);
        }
    }
}