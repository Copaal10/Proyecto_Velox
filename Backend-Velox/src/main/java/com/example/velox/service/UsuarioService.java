package com.example.velox.service;

import com.example.velox.model.Usuario;
import com.example.velox.repository.IusuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IusuarioService, UserDetailsService {

    @Autowired
    private IusuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario registrarUsuario(Usuario usuario) {
        // Validar campos obligatorios
        if (usuario.getEmail() == null || usuario.getClave() == null ||
                usuario.getNombre() == null || usuario.getApellido() == null) {
            throw new IllegalArgumentException("Todos los campos son obligatorios");
        }

        // Verificar si el usuario ya existe
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Si no se especifica rol, asignar 'cliente' por defecto
        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.Rol.cliente);
        }

        // Encriptar la contraseña
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));

        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Usuario editarUsuario(Integer id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        System.out.println("📝 Actualizando usuario ID: " + id);
        System.out.println("📝 Rol anterior: " + usuario.getRol());
        System.out.println("📝 Rol nuevo: " + usuarioActualizado.getRol());

        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setRol(usuarioActualizado.getRol());
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setDireccion(usuarioActualizado.getDireccion());

        if (usuarioActualizado.getClave() != null && !usuarioActualizado.getClave().isEmpty()) {
            System.out.println("📝 Actualizando contraseña");
            usuario.setClave(passwordEncoder.encode(usuarioActualizado.getClave()));
        } else {
            System.out.println("📝 Manteniendo contraseña actual");
        }

        Usuario guardado = usuarioRepository.save(usuario);
        System.out.println("✅ Usuario guardado con rol: " + guardado.getRol());

        return guardado;
    }

    @Override
    public Optional<Usuario> obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getClave(),
                new ArrayList<>()
        );
    }
}