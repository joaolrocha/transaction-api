# Multi-stage build para otimizar tamanho da imagem
FROM node:20.11.1-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Estágio de produção
FROM node:20.11.1-alpine AS production

# Instalar dumb-init para melhor handling de sinais
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json para instalar apenas deps de produção
COPY package*.json yarn.lock ./

# Instalar apenas dependências de produção
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copiar build da aplicação do estágio anterior
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Criar pasta para logs
RUN mkdir -p logs && chown nestjs:nodejs logs

# Mudar para usuário não-root
USER nestjs

# Expor porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["dumb-init", "node", "dist/main"]