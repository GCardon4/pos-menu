# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (capa cacheada)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Build de la SPA (las env vars están embebidas en quasar.config.js)
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:stable-alpine

# Copiar los archivos estáticos generados por Quasar
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO /dev/null http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
