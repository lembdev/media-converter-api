FROM alpine:3.22.2 AS base
WORKDIR /app
RUN apk add --no-cache nodejs npm

# ----------------------------
FROM base AS builder
ENV HUSKY=0
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ----------------------------
FROM base AS production
ENV HUSKY=0
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production 

# ----------------------------
FROM alpine:3.22.2 AS runner
WORKDIR /app

LABEL maintainer="lembdev@gmail.com"
LABEL version="1.2.0"
LABEL description="Media converter API with FFmpeg and FFprobe support"
LABEL org.opencontainers.image.source="https://github.com/lembdev/media-converter-api"
LABEL org.opencontainers.image.vendor="lembdev"

# Install runtime dependencies including FFmpeg
RUN apk add --no-cache nodejs ffmpeg && \
    mkdir -p /tmp/media-cache

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies and built application
COPY --from=production /app/node_modules      ./node_modules
COPY --from=production /app/package.json      ./package.json
COPY --from=production /app/package-lock.json ./package-lock.json
COPY --from=builder    /app/dist              ./dist

# Set ownership
RUN chown -R nodejs:nodejs /app /tmp/media-cache

USER nodejs

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

CMD ["node", "dist/main.js"]