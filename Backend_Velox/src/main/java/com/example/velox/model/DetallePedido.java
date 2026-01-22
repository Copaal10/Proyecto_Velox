package com.example.velox.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer id_detalle;

    @Column(name = "id_pedido", insertable = false, updatable = false)
    private Integer id_pedido;

    @Column(name = "id_producto", insertable = false, updatable = false)
    private Integer id_producto;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precio_unitario;

    @ManyToOne
    @JoinColumn(name = "id_pedido", referencedColumnName = "id_pedido")
    @JsonBackReference("pedido-detalles")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto", referencedColumnName = "id_producto")
    @JsonBackReference("producto-detalles")
    private Producto producto;

    public DetallePedido() {}

    public DetallePedido(Integer cantidad, BigDecimal precio_unitario) {
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
    }

    // Getters y Setters
    public Integer getId_detalle() { return id_detalle; }
    public void setId_detalle(Integer id_detalle) { this.id_detalle = id_detalle; }

    public Integer getId_pedido() { return id_pedido; }
    public void setId_pedido(Integer id_pedido) { this.id_pedido = id_pedido; }

    public Integer getId_producto() { return id_producto; }
    public void setId_producto(Integer id_producto) { this.id_producto = id_producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecio_unitario() { return precio_unitario; }
    public void setPrecio_unitario(BigDecimal precio_unitario) { this.precio_unitario = precio_unitario; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}