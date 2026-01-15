package com.velox.proyecto.backend.model;

import jakarta.persistence.*;

@Entity // Le dice a Java que esto es una tabla en la base de datos
@Table(name = "usuario") // El nombre exacto de tu tabla en MySQL
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID auto_increment
    @Column(name = "id_usuario") // El nombre de la columna en la BD
    private Long idUsuario;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 50)
    private String rol; // 'admin' o 'cliente'

    @Column(length = 50)
    private String nombre;

    @Column(length = 50)
    private String apellido;

    @Column(length = 255)
    private String clave;

    @Column(length = 100)
    private String direccion;

    // Constructor vacío (necesario para Hibernate)
    public Usuario() {}

    // Constructor con datos (útil para crear usuarios rápido)
    public Usuario(String email, String rol, String nombre, String apellido, String clave, String direccion) {
        this.email = email;
        this.rol = rol;
        this.nombre = nombre;
        this.apellido = apellido;
        this.clave = clave;
        this.direccion = direccion;
    }

    // Getters y Setters (Permiten leer y escribir los datos)
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}