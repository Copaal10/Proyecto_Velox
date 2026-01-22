package com.example.velox;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VeloxApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeloxApplication.class, args);
    }

    // --- GENERADOR DE HASHES PARA USUARIOS ---
    // --- GENERADOR DE HASHES PARA USUARIOS ---
    @Bean
    @SuppressWarnings("unused") // <--- ESTO LE DICE AL IDE QUE IGNORE EL ERROR
    public CommandLineRunner demo(PasswordEncoder encoder) {
        return (String[] arguments) -> { // Usamos un nombre explícito "arguments" en lugar de guion bajo
            System.out.println("--------------------------------------------------");
            System.out.println("HASHES GENERADOS PARA USUARIOS:");
            System.out.println("password123 (Juan) -> " + encoder.encode("password123"));
            System.out.println("securepass (Maria) -> " + encoder.encode("securepass"));
            System.out.println("carlos123 (Carlos) -> " + encoder.encode("carlos123"));
            System.out.println("anita2024 (Ana) -> " + encoder.encode("anita2024"));
            System.out.println("--------------------------------------------------");
        };
    }
}