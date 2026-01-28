package com.example.velox.service;

import com.example.velox.model.Producto;
import java.util.List;
import java.util.Optional;

public interface IproductoService {
    List<Producto> obtenerTodos();
    Optional<Producto> obtenerPorId(Integer id);
    Producto guardarProducto(Producto producto);
    void eliminarProducto(Integer id);
    Producto editarProducto(Integer id, Producto productoActualizado);
    List<Producto> obtenerProductosDisponibles();
}