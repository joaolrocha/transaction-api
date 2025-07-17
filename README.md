# Transaction API

Uma API REST para gerenciamento de transações financeiras com estatísticas em tempo real, desenvolvida com [NestJS](https://nestjs.com/) e [TypeScript](https://www.typescriptlang.org/)

## 🚀 Características

- **Clean Architecture** com separação clara de responsabilidades
- **Estatísticas em tempo real** dos últimos 60 segundos
- **Validações rigorosas** com class-validator
- **Logs estruturados** com Winston
- **Documentação automática** com Swagger
- **Testes completos** (unitários + integração)
- **Containerização** com Docker
- **Segurança** Helmet.js e Rate Limiting com @nestjs/throttler

## 📋 Endpoints

### Transações
- `POST /transactions` - Criar nova transação
- `DELETE /transactions` - Deletar todas as transações

### Estatísticas
- `GET /statistics` - Obter estatísticas dos últimos 60 segundos

### Monitoramento
- `GET /health` - Health check da aplicação

### Documentação
- `GET /api` - Documentação Swagger interativa

## 🛠️ Tecnologias

- **Framework:** NestJS 10.0.0
- **Linguagem:** TypeScript 5.1.3
- **Testes:** Jest
- **Validação:** class-validator
- **Documentação:** Swagger/OpenAPI
- **Logs:** Winston
- **Segurança:** Helmet.js, Rate Limiting com @nestjs/throttler 
- **Container:** Docker & docker-compose
- **Gerenciador:** Yarn

## 📦 Instalação

### Pré-requisitos
- Node.js 20.17
- Yarn 1.22.18
- Docker 27.5.1 (opcional)

### 1. Clonar repositório
```bash
git clone https://github.com/seu-usuario/transaction-api.git
cd transaction-api
```

### 2. Instalar dependências
```bash
yarn install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 4. Executar aplicação
```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
```

## 🐳 Docker

### Executar com Docker Compose
```bash
# Buildar e executar
docker compose up --build

# Em background
docker compose up --build -d

# Parar
docker compose down
```

### Executar apenas com Docker
```bash
# Buildar imagem
docker build -t transaction-api .

# Executar container
docker run -p 3000:3000 transaction-api
```

## 🧪 Testes

```bash
# Testes unitários
yarn test

# Testes de integração
yarn test:e2e

# Coverage
yarn test --coverage

# Todos os testes
yarn test && yarn test:e2e
```

## 📖 Uso da API

### Criar Transação
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 123.45,
    "timestamp": "2024-07-16T12:34:56.789Z"
  }'
```

### Obter Estatísticas
```bash
curl http://localhost:3000/statistics
```

**Resposta:**
```json
{
  "count": 10,
  "sum": 1234.56,
  "avg": 123.45,
  "min": 12.34,
  "max": 456.78
}
```

### Deletar Todas as Transações
```bash
curl -X DELETE http://localhost:3000/transactions
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🔒 Segurança

- **Rate Limiting:** 10 requests/minuto, 100 requests/5 minutos
- **Helmet.js:** Proteção contra ataques comuns
- **Validação rigorosa:** Todos os inputs são validados
- **Container não-root:** Docker executa com usuário limitado

## 📊 Monitoramento

- **Logs estruturados** em JSON (arquivos: `logs/app.log`, `logs/error.log`)
- **Health check** endpoint para monitoramento
- **Métricas** de rate limiting nos headers HTTP

## 🏗️ Arquitetura

```
src/
├── domain/                    # Regras de negócio
│   ├── entities/             # Objetos de domínio
│   └── repositories/         # Interfaces dos repositórios
├── application/              # Casos de uso
│   └── use-cases/           # Lógica de aplicação
├── infrastructure/          # Detalhes técnicos
│   ├── controllers/         # HTTP controllers
│   ├── repositories/        # Implementações dos repositórios
│   └── config/             # Configurações
└── shared/                  # Código compartilhado
    └── dto/                # Data Transfer Objects
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta da aplicação | `3000` |
| `LOG_LEVEL` | Nível dos logs | `info` |
| `RATE_LIMIT_SHORT_TTL` | TTL do rate limit curto (ms) | `60000` |
| `RATE_LIMIT_SHORT_LIMIT` | Limite do rate limit curto | `10` |
| `RATE_LIMIT_LONG_TTL` | TTL do rate limit longo (ms) | `300000` |
| `RATE_LIMIT_LONG_LIMIT` | Limite do rate limit longo | `100` |

## 📝 Regras de Negócio

### Transações
- **Amount:** Deve ser um número positivo ou zero
- **Timestamp:** Deve estar no formato ISO 8601 (UTC)
- **Validação temporal:** Transações não podem estar no futuro

### Estatísticas
- **Período:** Apenas transações dos últimos 60 segundos
- **Valores zerados:** Quando não há transações no período
- **Precisão:** Valores decimais com 2 casas

## 🚦 Status Codes

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Transação criada |
| `400` | Dados inválidos |
| `422` | Regra de negócio violada |
| `429` | Rate limit excedido |
| `500` | Erro interno |

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido por João Luiz Rocha como parte de um desafio técnico.

## 📚 Documentação Adicional

- **Swagger UI:** `http://localhost:3000/api`
- **Health Check:** `http://localhost:3000/health`
- **Logs:** Disponíveis em `logs/app.log` e `logs/error.log`