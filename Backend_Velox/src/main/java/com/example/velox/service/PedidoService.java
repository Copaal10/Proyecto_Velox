package com.example.velox.service;

import com.example.velox.model.DetallePedido;
import com.example.velox.model.Pedido;
import com.example.velox.model.Pedido.Estado;
import com.example.velox.model.Producto;
import com.example.velox.model.Usuario;
import com.example.velox.repository.IpedidoRepository;
import com.example.velox.repository.IproductoRepository;
import com.example.velox.repository.IusuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService implements IpedidoService {

    private final IpedidoRepository pedidoRepository;
    private final IusuarioRepository usuarioRepository;
    private final IproductoRepository productoRepository;

    public PedidoService(IpedidoRepository pedidoRepository,
                         IusuarioRepository usuarioRepository,
                         IproductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<Pedido> obtenerPorId(Integer id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.getDetallesPedido().size();

        return Optional.of(pedido);
    }

    @Transactional
    @Override
    public Pedido crearPedido(Integer usuarioId, List<DetallePedido> detalles) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(Estado.pendiente);
        pedido.setUsuario(usuario);

        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedido detalle : detalles) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId_producto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);

            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setPrecio_unitario(producto.getPrecio());

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(detalle.getCantidad()));
            total = total.add(subtotal);
        }

        pedido.setTotal(total);
        pedido.setDetallesPedido(detalles);

        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido actualizarEstadoPedido(Integer pedidoId, Estado nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);

        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Pedido> obtenerPedidosDeUsuario(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return pedidoRepository.findByUsuario(usuario);
    }

    @Override
    public List<Pedido> obtenerPedidosPorEstado(Estado estado) {
        return pedidoRepository.findByEstado(estado);
    }
}