# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências do sistema necessárias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

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

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Muda a propriedade dos arquivos para o usuário nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Adiciona healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
