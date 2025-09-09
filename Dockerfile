# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências do sistema necessárias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências com resolução de conflitos
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera os artefatos do Prisma (Client)
COPY prisma ./prisma
RUN npx prisma generate

# Compila o projeto NestJS
RUN npm run build

# Etapa 2: imagem final para produção
FROM node:18-alpine

WORKDIR /app

# Instala dependências do sistema necessárias para Prisma Client
RUN apk add --no-cache libc6-compat openssl

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Define variáveis de ambiente
ENV NODE_ENV=production

# Gera novamente o Prisma Client no ambiente final
RUN npx prisma generate

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]