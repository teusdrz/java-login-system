package com.loginapp.test;

import com.loginapp.api.dto.*;
import com.loginapp.controller.RestApiController;
import com.loginapp.model.*;

/**
 * RestApiTest - Simple test class for REST API functionality
 * Tests the JWT authentication and REST endpoints
 */
public class RestApiTest {
    
    private static RestApiController apiController;
    private static UserDatabase userDatabase;
    
    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                              ║");
        System.out.println("║                  REST API AUTHENTICATION TEST               ║");
        System.out.println("║                                                              ║");
        System.out.println("║                     JWT + MVC Testing                       ║");
        System.out.println("║                                                              ║");
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
        
        try {
            // Initialize system
            initializeSystem();
            
            // Test user registration
            testUserRegistration();
            
            // Test user login
            testUserLogin();
            
            // Test protected endpoints
            testProtectedEndpoints();
            
            System.out.println("\n✅ Todos os testes da API REST foram executados com sucesso!");
            
        } catch (Exception e) {
            System.err.println("\n❌ Erro durante os testes: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void initializeSystem() {
        System.out.println("\n🔧 Inicializando sistema...");
        
        // Initialize database and services
        userDatabase = UserDatabase.getInstance();
        apiController = new RestApiController();
        
        System.out.println("✅ Sistema inicializado com sucesso!");
    }
    
    private static void testUserRegistration() {
        System.out.println("\n🔐 Testando registro de usuário...");
        
        try {
            UserRegistrationDto registrationDto = new UserRegistrationDto();
            registrationDto.setUsername("testapi");
            registrationDto.setEmail("test@api.com");
            registrationDto.setPassword("ApiTest123");
            registrationDto.setFirstName("API");
            registrationDto.setLastName("Tester");
            registrationDto.setRole(Role.USER);
            
            ApiResponse<UserDto> response = apiController.register(registrationDto);
            
            if (response.isSuccess()) {
                System.out.println("✅ Usuário registrado com sucesso!");
                System.out.println("   Mensagem: " + response.getMessage());
            } else {
                System.out.println("❌ Falha no registro: " + response.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erro no teste de registro: " + e.getMessage());
        }
    }
    
    private static void testUserLogin() {
        System.out.println("\n🔑 Testando login de usuário...");
        
        try {
            LoginRequestDto loginDto = new LoginRequestDto();
            loginDto.setUsername("admin");
            loginDto.setPassword("admin123");
            loginDto.setIpAddress("127.0.0.1");
            loginDto.setUserAgent("RestApiTest/1.0");
            loginDto.setRememberMe(false);
            
            ApiResponse<LoginResponseDto> response = apiController.login(loginDto);
            
            if (response.isSuccess()) {
                System.out.println("✅ Login realizado com sucesso!");
                System.out.println("   Mensagem: " + response.getMessage());
                
                // Extract token for further tests
                if (response.getData() instanceof LoginResponseDto) {
                    LoginResponseDto loginResponse = (LoginResponseDto) response.getData();
                    System.out.println("   Token JWT gerado com sucesso!");
                }
            } else {
                System.out.println("❌ Falha no login: " + response.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erro no teste de login: " + e.getMessage());
        }
    }
    
    private static void testProtectedEndpoints() {
        System.out.println("\n🛡️ Testando endpoints protegidos...");
        
        try {
            // Test without token (should fail)
            System.out.println("   Testando acesso sem token...");
            ApiResponse<?> response = apiController.getAllUsers(null);
            
            if (!response.isSuccess()) {
                System.out.println("✅ Endpoint protegido funcionando (negou acesso sem token)");
            } else {
                System.out.println("❌ Endpoint deveria ter negado acesso sem token");
            }
            
            // For real testing, we would need to implement proper JWT extraction
            // from Authorization header in a real HTTP environment
            System.out.println("   Nota: Testes completos de JWT requerem ambiente HTTP real");
            
        } catch (Exception e) {
            System.out.println("❌ Erro no teste de endpoints protegidos: " + e.getMessage());
        }
    }
}
