package com.example.velox.controller;

import com.example.velox.dto.LoginDto;
import com.example.velox.model.Usuario;
import com.example.velox.security.JwtUtil;
import com.example.velox.service.IusuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private IusuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Usuario registrado con éxito");
            response.put("usuario", Map.of(
                    "id", nuevoUsuario.getId_usuario(),
                    "email", nuevoUsuario.getEmail(),
                    "nombre", nuevoUsuario.getNombre(),
                    "apellido", nuevoUsuario.getApellido(),
                    "rol", nuevoUsuario.getRol()
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            UserDetails userDetails = usuarioService.loadUserByUsername(loginDto.getEmail());

            if (userDetails != null && passwordEncoder.matches(loginDto.getClave(), userDetails.getPassword())) {
                String token = jwtUtil.generateToken(userDetails.getUsername());

                Usuario usuario = usuarioService.obtenerPorEmail(loginDto.getEmail())
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("usuario", Map.of(
                        "id", usuario.getId_usuario(),
                        "email", usuario.getEmail(),
                        "nombre", usuario.getNombre(),
                        "apellido", usuario.getApellido(),
                        "rol", usuario.getRol()
                ));

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
    }
}