package com.loginapp.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * TestHttpServer - Servidor HTTP básico para testar
 */
public class TestHttpServer {
    
    private final HttpServer server;
    
    public TestHttpServer(int port) throws IOException {
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        setupRoutes();
    }
    
    private void setupRoutes() {
        server.createContext("/", new TestHandler());
        server.createContext("/api/test", new TestHandler());
    }
    
    public void start() {
        server.setExecutor(null);
        server.start();
        System.out.println("🚀 Test HTTP Server started on port 8080");
        System.out.println("📋 Test endpoint: http://localhost:8080/api/test");
    }
    
    public void stop() {
        server.stop(0);
        System.out.println("🛑 Test HTTP Server stopped");
    }
    
    class TestHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "{\"message\": \"Test server is working!\", \"timestamp\": \"" + java.time.LocalDateTime.now() + "\"}";
            
            // Set CORS headers
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, responseBytes.length);
            
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }
    }
    
    public static void main(String[] args) {
        try {
            TestHttpServer server = new TestHttpServer(8080);
            server.start();
            
            // Keep server running
            System.out.println("Press Enter to stop the server...");
            System.in.read();
            
            server.stop();
        } catch (IOException e) {
            System.err.println("Failed to start test server: " + e.getMessage());
        }
    }
}
