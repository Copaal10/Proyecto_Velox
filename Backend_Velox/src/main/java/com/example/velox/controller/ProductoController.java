package com.example.velox.controller;

import com.example.velox.model.Producto;
import com.example.velox.service.IproductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final IproductoService productoService;

    public ProductoController(IproductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Producto obtenerProducto(@PathVariable Integer id) {
        return productoService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @GetMapping("/disponibles")
    public List<Producto> obtenerProductosDisponibles() {
        return productoService.obtenerProductosDisponibles();
    }

    @PostMapping("/crear")
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    @PutMapping("/editar/{id}")
    public Producto editarProducto(@PathVariable Integer id, @RequestBody Producto productoActualizado) {
        return productoService.editarProducto(id, productoActualizado);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarProducto(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok("Producto eliminado con éxito");
    }
}