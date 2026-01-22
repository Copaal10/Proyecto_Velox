package com.example.velox.controller;

import com.example.velox.model.Pedido;
import com.example.velox.model.Pedido.Estado;
import com.example.velox.service.IpedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final IpedidoService pedidoService;

    public PedidoController(IpedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPedido(@PathVariable Integer id) {
        return pedidoService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPedidosDeUsuario(@PathVariable Integer usuarioId) {
        return pedidoService.obtenerPedidosDeUsuario(usuarioId);
    }

    @GetMapping("/estado/{estado}")
    public List<Pedido> obtenerPedidosPorEstado(@PathVariable Estado estado) {
        return pedidoService.obtenerPedidosPorEstado(estado);
    }

    @PostMapping("/crear")
    public Pedido crearPedido(@RequestBody Map<String, Object> pedidoData) {
        Integer usuarioId = Integer.valueOf(pedidoData.get("usuarioId").toString());
        return pedidoService.crearPedido(usuarioId, (List) pedidoData.get("detalles"));
    }

    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(
            @PathVariable Integer id,
            @RequestBody Map<String, String> estadoData) {

        Estado nuevoEstado = Estado.valueOf(estadoData.get("estado"));
        return pedidoService.actualizarEstadoPedido(id, nuevoEstado);
    }
}