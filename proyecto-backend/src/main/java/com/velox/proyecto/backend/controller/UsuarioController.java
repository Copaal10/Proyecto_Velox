package com.velox.proyecto.backend.controller;

import com.velox.proyecto.backend.model.Usuario;           // <--- Cambiado a proyecto
import com.velox.proyecto.backend.repository.UsuarioRepository; // <--- Cambiado a proyecto
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Esto hace que esta clase responda a peticiones web (API)
@RequestMapping("/api/usuarios") // La URL base: http://localhost:8080/api/usuarios
@CrossOrigin(origins = "*") // IMPORTANTE: Permite que tu archivo HTML hable con Java
public class UsuarioController {

    @Autowired // Conecta automáticamente el repositorio
    private UsuarioRepository usuarioRepository;

    // 1. OBTENER TODOS LOS USUARIOS (GET)
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        System.out.println("➡️ [BACKEND] Petición recibida: Listar usuarios");
        return usuarioRepository.findAll();
    }

    // 2. CREAR USUARIO (POST)
    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        System.out.println("➡️ [BACKEND] Creando usuario: " + usuario.getEmail());
        return usuarioRepository.save(usuario);
    }

    // 3. ELIMINAR USUARIO (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        System.out.println("➡️ [BACKEND] Eliminando usuario ID: " + id);
        if(usuarioRepository.existsById(id)){
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. ACTUALIZAR USUARIO (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetails) {
        System.out.println("➡️ [BACKEND] Actualizando usuario ID: " + id);
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setEmail(usuarioDetails.getEmail());
                    usuario.setNombre(usuarioDetails.getNombre());
                    usuario.setApellido(usuarioDetails.getApellido());
                    // Solo actualizamos clave si viene vacía
                    if(usuarioDetails.getClave() != null && !usuarioDetails.getClave().isEmpty()) {
                        usuario.setClave(usuarioDetails.getClave());
                    }
                    usuario.setRol(usuarioDetails.getRol());
                    usuario.setDireccion(usuarioDetails.getDireccion());

                    Usuario updatedUsuario = usuarioRepository.save(usuario);
                    return ResponseEntity.ok().body(updatedUsuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}