package com.example.velox;

import org.springframework.boot.CommandLineRunner; // <--- IMPORTANTE AGREGAR ESTE
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VeloxApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeloxApplication.class, args);
    }

    // --- ESTE MÉTODO VA DENTRO DE LA CLASE ---
    @Bean
    public CommandLineRunner demo(PasswordEncoder encoder) {
        return args -> {
            System.out.println("--------------------------------------------------");
            System.out.println("HASHES GENERADOS PARA USUARIOS:");
            System.out.println("password123 -> " + encoder.encode("password123")); // Juan
            System.out.println("securepass -> " + encoder.encode("securepass"));   // Maria
            System.out.println("carlos123 -> " + encoder.encode("carlos123")); // Carlos
            System.out.println("anita2024 -> " + encoder.encode("anita2024"));   // Ana
            System.out.println("--------------------------------------------------");
        };
    }
}