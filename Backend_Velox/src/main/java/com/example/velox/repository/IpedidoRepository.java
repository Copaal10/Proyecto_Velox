package com.example.velox.repository;

import com.example.velox.model.Pedido;
import com.example.velox.model.Pedido.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IpedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByUsuario(com.example.velox.model.Usuario usuario);
    List<Pedido> findByEstado(Estado estado);
}