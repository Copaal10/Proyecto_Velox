package com.example.velox.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id_usuario;

    @Column(name = "email", length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", columnDefinition = "ENUM('admin', 'cliente')")
    private Rol rol;

    @Column(name = "nombre", length = 50)
    private String nombre;

    @Column(name = "apellido", length = 50)
    private String apellido;

    @Column(name = "clave", length = 255)
    private String clave;

    @Column(name = "direccion", length = 100)
    private String direccion;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("usuario-pedidos")
    private List<Pedido> pedidos;

    public Usuario() {}

    public Usuario(String email, Rol rol, String nombre, String apellido, String clave, String direccion) {
        this.email = email;
        this.rol = rol;
        this.nombre = nombre;
        this.apellido = apellido;
        this.clave = clave;
        this.direccion = direccion;
    }

    // Getters y Setters
    public Integer getId_usuario() { return id_usuario; }
    public void setId_usuario(Integer id_usuario) { this.id_usuario = id_usuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }

    public enum Rol {
        admin, cliente
    }
}