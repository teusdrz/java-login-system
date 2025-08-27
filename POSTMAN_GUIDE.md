# 🚀 Postman Testing Guide

## Quick Setup

### 1. Import Collections
In Postman, click **Import** and select these files:
- `postman/collections/01-authentication-api.postman_collection.json`
- `postman/collections/02-user-management-api.postman_collection.json`
- `postman/collections/03-audit-system-api.postman_collection.json`
- `postman/collections/04-notification-api.postman_collection.json`

### 2. Import Environment
Import the development environment:
- `postman/environments/development.postman_environment.json`

### 3. Set Base URL
In the environment, set:
- `baseUrl`: `http://localhost:8080/api/v1`

### 4. Run Tests
1. Start your Java application
2. Select the "Development" environment
3. Run collections in order:
   - 🔐 Authentication API (30 tests)
   - 👥 User Management API (59 tests)  
   - 📊 Audit System API (74 tests)
   - 🔔 Notification API (67 tests)

## Features
- ✅ **230+ comprehensive tests**
- ✅ **Pre-request scripts** for setup
- ✅ **Test assertions** for validation
- ✅ **Environment variables** for tokens
- ✅ **Complete API coverage**

## Results
Expected: **100% pass rate** on all tests with proper server setup.
