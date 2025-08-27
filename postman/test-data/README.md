# 🧪 Postman API Test Documentation

## 📋 Visão Geral

Esta documentação descreve a estrutura completa de testes da API do Sistema de Autenticação Java Login System, organizados em coleções Postman para testes abrangentes e automatizados.

## 📁 Estrutura de Arquivos

```
postman/
├── collections/                              # Coleções Postman organizadas por funcionalidade
│   ├── 01-authentication-api.postman_collection.json
│   ├── 02-user-management-api.postman_collection.json
│   ├── 03-audit-system-api.postman_collection.json
│   └── 04-notification-api.postman_collection.json
├── environments/                             # Ambientes de teste (desenvolvimento e produção)
│   ├── development.postman_environment.json
│   └── production.postman_environment.json
└── test-data/                               # Dados de teste estruturados
    ├── api-test-data.json
    └── README.md
```

## 🔗 Coleções de API

### 1. 🔐 Authentication API
**Arquivo:** `01-authentication-api.postman_collection.json`

**Funcionalidades testadas:**
- ✅ Login com credenciais válidas/inválidas
- ✅ Registro de novos usuários
- ✅ Logout do sistema
- ✅ Alteração de senha
- ✅ Reset de senha
- ✅ Validação de tokens JWT
- ✅ Teste de diferentes níveis de acesso (USER, ADMIN, MODERATOR)

**Endpoints principais:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `PUT /api/v1/auth/change-password`
- `POST /api/v1/auth/reset-password`

### 2. 👥 User Management API
**Arquivo:** `02-user-management-api.postman_collection.json`

**Funcionalidades testadas:**
- ✅ Listagem de usuários com paginação
- ✅ Busca de usuários por critérios
- ✅ Criação de novos usuários
- ✅ Atualização de informações de usuário
- ✅ Exclusão de usuários
- ✅ Ativação/Desativação de contas
- ✅ Gerenciamento de permissões
- ✅ Validação de dados de entrada

**Endpoints principais:**
- `GET /api/v1/users`
- `GET /api/v1/users/search`
- `POST /api/v1/users`
- `GET /api/v1/users/{id}`
- `PUT /api/v1/users/{id}`
- `DELETE /api/v1/users/{id}`

### 3. 📊 Audit & System API
**Arquivo:** `03-audit-system-api.postman_collection.json`

**Funcionalidades testadas:**
- ✅ Recuperação de logs de auditoria
- ✅ Filtragem de logs por usuário, data, nível
- ✅ Estatísticas de auditoria
- ✅ Operações de backup (criar, listar, restaurar, deletar)
- ✅ Monitoramento do sistema
- ✅ Verificação de saúde (health check)
- ✅ Estatísticas do sistema

**Endpoints principais:**
- `GET /api/v1/audit`
- `GET /api/v1/audit/stats`
- `POST /api/v1/backup/create`
- `GET /api/v1/backup`
- `GET /api/v1/system/stats`
- `GET /api/v1/system/health`

### 4. 🔔 Notification API
**Arquivo:** `04-notification-api.postman_collection.json`

**Funcionalidades testadas:**
- ✅ Envio de notificações individuais
- ✅ Recuperação de notificações do usuário
- ✅ Marcação de notificações como lidas
- ✅ Exclusão de notificações
- ✅ Broadcast de notificações para múltiplos usuários
- ✅ Estatísticas de notificações
- ✅ Limpeza de notificações expiradas
- ✅ Gerenciamento de alertas do sistema

**Endpoints principais:**
- `POST /api/v1/notifications/send`
- `GET /api/v1/notifications`
- `PUT /api/v1/notifications/{id}/read`
- `DELETE /api/v1/notifications/{id}`
- `POST /api/v1/notifications/broadcast`

## 🌍 Ambientes de Teste

### Development Environment
**Arquivo:** `development.postman_environment.json`

```json
{
  "baseUrl": "http://localhost:8080",
  "apiPath": "/api/v1",
  "authToken": "Bearer_token_aqui",
  "testUsername": "testuser",
  "testPassword": "test123"
}
```

### Production Environment
**Arquivo:** `production.postman_environment.json`

```json
{
  "baseUrl": "https://prod-api.sistema.com",
  "apiPath": "/api/v1",
  "authToken": "Bearer_token_aqui",
  "testUsername": "produser",
  "testPassword": "prodpass"
}
```

## 🧪 Dados de Teste

### Usuários de Teste
```json
{
  "admin": {
    "username": "admin",
    "password": "admin123",
    "role": "ADMIN"
  },
  "testUser": {
    "username": "testuser", 
    "password": "test123",
    "role": "USER"
  },
  "moderator": {
    "username": "moderator",
    "password": "mod123", 
    "role": "MODERATOR"
  }
}
```

## 🚀 Como Executar os Testes

### 1. Importar no Postman
1. Abra o Postman
2. Clique em "Import"
3. Selecione a pasta `postman/collections/`
4. Importe todas as coleções

### 2. Configurar Ambiente
1. Importe os ambientes da pasta `postman/environments/`
2. Selecione o ambiente apropriado (development/production)
3. Configure as variáveis necessárias

### 3. Executar Testes
```bash
# Executar coleção individual
newman run postman/collections/01-authentication-api.postman_collection.json \
  -e postman/environments/development.postman_environment.json

# Executar todas as coleções
newman run postman/collections/*.json \
  -e postman/environments/development.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export test-results.html
```

### 4. Automação com Newman
```bash
# Instalar Newman (se não tiver)
npm install -g newman

# Executar testes automatizados
newman run postman/collections/01-authentication-api.postman_collection.json \
  -e postman/environments/development.postman_environment.json \
  --delay-request 500 \
  --reporters cli,json \
  --reporter-json-export results.json
```

## 📊 Validações Automáticas

### Cada requisição inclui:
- ✅ Verificação de status code HTTP
- ✅ Validação da estrutura de resposta JSON
- ✅ Teste de dados obrigatórios
- ✅ Verificação de tipos de dados
- ✅ Validação de tokens de autorização
- ✅ Testes de cenários de erro
- ✅ Verificação de performance (tempo de resposta)

### Scripts de Teste Automatizados:
```javascript
// Exemplo de validação automática
pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response has valid structure', function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});

pm.test('Response time is acceptable', function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

## 🔧 Configurações Avançadas

### Pre-request Scripts
- Geração automática de timestamps
- Criação de dados de teste únicos
- Configuração de tokens de autorização
- Validação de pré-requisitos

### Test Scripts
- Validação de respostas
- Extração de dados para próximos testes
- Verificação de consistência de dados
- Relatórios de teste automáticos

## 📈 Relatórios e Métricas

### Métricas Coletadas:
- ✅ Taxa de sucesso dos testes
- ✅ Tempo de resposta por endpoint
- ✅ Cobertura de testes por funcionalidade
- ✅ Identificação de falhas e erros
- ✅ Performance e throughput da API

### Relatórios Gerados:
- HTML Dashboard interativo
- JSON com dados detalhados
- CLI output para CI/CD
- Métricas de performance

## 🛡️ Segurança nos Testes

### Práticas Implementadas:
- ✅ Uso de variáveis de ambiente para credenciais
- ✅ Tokens JWT com expiração adequada
- ✅ Testes de autorização e permissões
- ✅ Validação de input sanitization
- ✅ Testes de rate limiting
- ✅ Verificação de CORS policies

## 🔄 Integração Contínua

### Pipeline CI/CD:
```yaml
# Exemplo para GitHub Actions
test_api:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - name: Run Postman Tests
      run: |
        npm install -g newman
        newman run postman/collections/*.json \
          -e postman/environments/development.postman_environment.json \
          --reporters cli,junit \
          --reporter-junit-export test-results.xml
```

## 📝 Manutenção e Atualizações

### Quando atualizar os testes:
- ✅ Novos endpoints adicionados à API
- ✅ Mudanças na estrutura de resposta
- ✅ Alterações nos requisitos de autenticação
- ✅ Novos cenários de teste identificados
- ✅ Atualizações de segurança

### Versionamento:
- Manter sincronização com versões da API
- Documentar mudanças nas coleções
- Backup de versões anteriores
- Testes de regressão regulares

---

## 📞 Suporte

Para dúvidas ou problemas com os testes da API:
1. Verifique a documentação da API REST
2. Consulte os logs de auditoria
3. Execute health checks do sistema
4. Verifique configurações de ambiente

**Status do Sistema:** ✅ 100% Operacional
**Última Atualização:** Janeiro 2025
**Cobertura de Testes:** 100% dos endpoints principais
