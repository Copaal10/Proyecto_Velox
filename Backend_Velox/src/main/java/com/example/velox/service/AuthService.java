package com.example.velox.service;

import com.example.velox.dto.AuthResponseDTO;
import com.example.velox.dto.LoginDTO;
import com.example.velox.model.Usuario;
import com.example.velox.repository.IusuarioRepository;
import com.example.velox.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private IusuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginDTO loginDTO) {
        System.out.println("NUEVO HASH PARA 123456: " + passwordEncoder.encode("123456"));

        // 1. Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // --- INICIO DIAGNÓSTICO ---
        System.out.println("--------------------------------------------------");
        System.out.println("EMAIL ENCONTRADO: " + usuario.getEmail());
        System.out.println("CLAVE EN BD (HASH): " + usuario.getClave());
        System.out.println("CLAVE RECIBIDA (TEXTO): '" + loginDTO.getClave() + "'");

        // Comparación
        boolean coincide = passwordEncoder.matches(loginDTO.getClave(), usuario.getClave());
        System.out.println("¿LAS CLAVES COINCIDEN? " + coincide);
        System.out.println("--------------------------------------------------");
        // --- FIN DIAGNÓSTICO ---

        // 2. Verificar la contraseña
        if (!coincide) { // Usamos la variable booleana 'coincide'
            throw new RuntimeException("Contraseña incorrecta");
        }

        // 3. Generar el Token JWT
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());

        // 4. Retornar la respuesta con el token y datos del usuario
        return new AuthResponseDTO(token, usuario.getEmail(), usuario.getRol().name());
    }
}