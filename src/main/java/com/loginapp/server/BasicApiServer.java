package com.loginapp.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * BasicApiServer - Servidor básico com endpoints de autenticação
 */
public class BasicApiServer {

    private final HttpServer server;
    private final Map<String, String> users = new HashMap<>();
    private final Set<String> tokens = new HashSet<>();

    public BasicApiServer(int port) throws IOException {
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        setupDefaultUsers();
        setupRoutes();
    }

    private void setupDefaultUsers() {
        users.put("admin@admin.com", "admin123");
        users.put("user@user.com", "user123");
        System.out.println("✓ Default users created:");
        System.out.println("  Admin: admin@admin.com / admin123");
        System.out.println("  User: user@user.com / user123");
    }

    private void setupRoutes() {
        server.createContext("/api/auth/register", new RegisterHandler());
        server.createContext("/api/auth/login", new LoginHandler());
        server.createContext("/api/auth/logout", new LogoutHandler());
        server.createContext("/api/test", new TestHandler());
        server.createContext("/", new CorsHandler());
    }

    public void start() {
        server.setExecutor(null);
        server.start();
        System.out.println("🚀 Basic API Server started on port 8080");
        System.out.println("📋 Available endpoints:");
        System.out.println("   POST http://localhost:8080/api/auth/login");
        System.out.println("   POST http://localhost:8080/api/auth/register");
        System.out.println("   POST http://localhost:8080/api/auth/logout");
        System.out.println("   GET  http://localhost:8080/api/test");
    }

    public void stop() {
        server.stop(0);
        System.out.println("🛑 Basic API Server stopped");
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
            return body.toString();
        }
    }

    private void sendJsonResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        // Set CORS headers
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);

        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

    class TestHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "{\"success\": true, \"message\": \"Backend is working!\", \"timestamp\": \""
                    + java.time.LocalDateTime.now() + "\"}";
            sendJsonResponse(exchange, response, 200);
        }
    }

    class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, "", 200);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    String requestBody = readRequestBody(exchange);
                    System.out.println("Register request: " + requestBody);

                    // Simulação simples de parsing JSON
                    String email = extractJsonValue(requestBody, "email");
                    String password = extractJsonValue(requestBody, "password");
                    String username = extractJsonValue(requestBody, "username");

                    if (email != null && password != null && username != null) {
                        if (users.containsKey(email)) {
                            String response = "{\"success\": false, \"message\": \"User already exists\"}";
                            sendJsonResponse(exchange, response, 400);
                        } else {
                            users.put(email, password);
                            String token = "token_" + System.currentTimeMillis();
                            tokens.add(token);
                            String response = "{\"success\": true, \"message\": \"User registered successfully\", \"data\": {\"token\": \""
                                    + token + "\", \"user\": {\"email\": \"" + email + "\", \"username\": \"" + username
                                    + "\", \"role\": \"USER\"}}}";
                            sendJsonResponse(exchange, response, 201);
                        }
                    } else {
                        String response = "{\"success\": false, \"message\": \"Missing required fields\"}";
                        sendJsonResponse(exchange, response, 400);
                    }
                } catch (Exception e) {
                    String response = "{\"success\": false, \"message\": \"Registration failed: " + e.getMessage()
                            + "\"}";
                    sendJsonResponse(exchange, response, 400);
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, "", 200);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    String requestBody = readRequestBody(exchange);
                    System.out.println("Login request: " + requestBody);

                    String email = extractJsonValue(requestBody, "email");
                    String password = extractJsonValue(requestBody, "password");

                    if (email != null && password != null && users.containsKey(email)
                            && users.get(email).equals(password)) {
                        String token = "token_" + System.currentTimeMillis();
                        tokens.add(token);
                        String role = email.contains("admin") ? "ADMIN" : "USER";
                        String response = "{\"success\": true, \"message\": \"Login successful\", \"data\": {\"token\": \""
                                + token + "\", \"user\": {\"email\": \"" + email + "\", \"username\": \""
                                + email.split("@")[0] + "\", \"role\": \"" + role + "\"}}}";
                        sendJsonResponse(exchange, response, 200);
                    } else {
                        String response = "{\"success\": false, \"message\": \"Invalid credentials\"}";
                        sendJsonResponse(exchange, response, 401);
                    }
                } catch (Exception e) {
                    String response = "{\"success\": false, \"message\": \"Login failed: " + e.getMessage() + "\"}";
                    sendJsonResponse(exchange, response, 400);
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, "", 200);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    tokens.remove(token);
                }
                String response = "{\"success\": true, \"message\": \"Logout successful\"}";
                sendJsonResponse(exchange, response, 200);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    class CorsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
                exchange.sendResponseHeaders(200, -1);
            }
        }
    }

    private String extractJsonValue(String json, String key) {
        try {
            String keyPattern = "\"" + key + "\"";
            int keyIndex = json.indexOf(keyPattern);
            if (keyIndex == -1)
                return null;

            int colonIndex = json.indexOf(":", keyIndex);
            if (colonIndex == -1)
                return null;

            int valueStart = json.indexOf("\"", colonIndex) + 1;
            int valueEnd = json.indexOf("\"", valueStart);

            if (valueStart > 0 && valueEnd > valueStart) {
                return json.substring(valueStart, valueEnd);
            }
        } catch (Exception e) {
            System.err.println("Error parsing JSON: " + e.getMessage());
        }
        return null;
    }

    public static void main(String[] args) {
        try {
            BasicApiServer server = new BasicApiServer(8080);
            server.start();

            // Check if running in background mode
            boolean background = args.length > 0 && "background".equals(args[0]);

            if (!background) {
                // Keep server running - wait for user input
                System.out.println("Press Enter to stop the server...");
                System.in.read();
                server.stop();
            } else {
                // Background mode - keep running indefinitely
                System.out.println("Running in background mode. Use 'pkill -f BasicApiServer' to stop.");
                // Add shutdown hook to gracefully stop the server
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    System.out.println("Shutting down server...");
                    server.stop();
                }));

                // Keep the main thread alive
                while (true) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        System.out.println("Server interrupted, shutting down...");
                        server.stop();
                        break;
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
        }
    }
}
