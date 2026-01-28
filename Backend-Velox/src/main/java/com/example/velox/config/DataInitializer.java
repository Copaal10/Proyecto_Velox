package com.example.velox.config;

import com.example.velox.model.Usuario;
import com.example.velox.repository.IusuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IusuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        System.out.println("\n════════════════════════════════════════════");
        System.out.println("🚀 INICIALIZANDO USUARIOS DEL SISTEMA");
        System.out.println("════════════════════════════════════════════\n");

        // ============================================
        // CREAR USUARIO ADMINISTRADOR
        // ============================================
        if (usuarioRepository.findByEmail("admin@velox.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setEmail("admin@velox.com");
            admin.setClave(passwordEncoder.encode("Admin123!"));
            admin.setRol(Usuario.Rol.admin);
            admin.setDireccion("Oficina Central Velox");

            usuarioRepository.save(admin);

            System.out.println("✅ Usuario ADMIN creado correctamente");
            System.out.println("   📧 Email: admin@velox.com");
            System.out.println("   🔑 Contraseña: Admin123!");
        } else {
            System.out.println("ℹ️  Usuario ADMIN ya existe");
        }

        // ============================================
        // CREAR USUARIO CLIENTE
        // ============================================
        if (usuarioRepository.findByEmail("cliente@velox.com").isEmpty()) {
            Usuario cliente = new Usuario();
            cliente.setNombre("Juan");
            cliente.setApellido("Pérez");
            cliente.setEmail("cliente@velox.com");
            cliente.setClave(passwordEncoder.encode("Cliente123!"));
            cliente.setRol(Usuario.Rol.cliente);
            cliente.setDireccion("Calle 123 #45-67, Bogotá");

            usuarioRepository.save(cliente);

            System.out.println("✅ Usuario CLIENTE creado correctamente");
            System.out.println("   📧 Email: cliente@velox.com");
            System.out.println("   🔑 Contraseña: Cliente123!");
        } else {
            System.out.println("ℹ️  Usuario CLIENTE ya existe");
        }

        System.out.println("\n════════════════════════════════════════════");
        System.out.println("🎉 INICIALIZACIÓN COMPLETADA");
        System.out.println("════════════════════════════════════════════\n");
    }
}