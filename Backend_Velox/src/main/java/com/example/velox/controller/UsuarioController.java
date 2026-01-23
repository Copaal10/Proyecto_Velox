package com.example.velox.controller;

import com.example.velox.model.Usuario;
import com.example.velox.repository.IusuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class UsuarioController {

    @Autowired
    private IusuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Listar usuarios (Para llenar la tabla en el frontend)
    @GetMapping("/usuarios")
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // 2. Crear usuario (Admin crea usuario en BD con clave encriptada)
    @PostMapping("/usuarios")
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        // Encriptar clave antes de guardar
        String claveEncriptada = passwordEncoder.encode(usuario.getClave());
        usuario.setClave(claveEncriptada);

        // Poner rol por defecto si viene vacío
        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.Rol.cliente);
        }

        return usuarioRepository.save(usuario);
    }

    // 3. Eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    public void eliminarUsuario(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}