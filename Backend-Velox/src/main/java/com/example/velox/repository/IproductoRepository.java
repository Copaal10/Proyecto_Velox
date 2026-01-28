package com.example.velox.repository;

import com.example.velox.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IproductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByStockGreaterThan(Integer stock);
}
