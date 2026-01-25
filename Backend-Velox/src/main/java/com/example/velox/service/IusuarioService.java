package com.example.velox.service;

import com.example.velox.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface IusuarioService {
    List<Usuario> obtenerTodos();
    Optional<Usuario> obtenerPorId(Integer id);
    Usuario guardarUsuario(Usuario usuario);
    void eliminarUsuario(Integer id);
    Usuario editarUsuario(Integer id, Usuario usuarioActualizado);
    Optional<Usuario> obtenerPorEmail(String email);
}