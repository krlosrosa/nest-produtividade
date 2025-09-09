# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências do sistema necessárias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps


# Copia o restante do código
COPY . .

# Gera os artefatos do Prisma
RUN npx prisma generate

# Compila o projeto
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

# Define variáveis de ambiente (opcional)
ENV NODE_ENV=production

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
