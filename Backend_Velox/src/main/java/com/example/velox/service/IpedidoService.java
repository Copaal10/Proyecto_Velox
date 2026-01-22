package com.example.velox.service;

import com.example.velox.model.DetallePedido;
import com.example.velox.model.Pedido;
import com.example.velox.model.Pedido.Estado;
import java.util.List;
import java.util.Optional;

public interface IpedidoService {
    List<Pedido> obtenerTodos();
    Optional<Pedido> obtenerPorId(Integer id);
    Pedido crearPedido(Integer usuarioId, List<DetallePedido> detalles);
    Pedido actualizarEstadoPedido(Integer pedidoId, Estado nuevoEstado);
    List<Pedido> obtenerPedidosDeUsuario(Integer usuarioId);
    List<Pedido> obtenerPedidosPorEstado(Estado estado);
}
