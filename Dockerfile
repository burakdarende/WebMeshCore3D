# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev deps needed for build)
# Use the same legacy-peer-deps behavior as local dev to avoid peer conflicts
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove devDependencies to keep the build artifacts lean
RUN npm prune --production --no-audit --no-fund

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# (node_modules copied from builder) Clean npm cache
RUN npm cache clean --force

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
# Optional: set this to 'true' to expose debug UI panels when the app reads env flags
# Note: app-config currently gates debug UI via DEVELOPER_CONFIG; wiring to this env var
# requires editing `src/config/app-config.js` to read `process.env.NEXT_PUBLIC_ENABLE_DEBUG_UI`.
ENV NEXT_PUBLIC_ENABLE_DEBUG_UI=false

CMD ["dumb-init", "npm", "start"]