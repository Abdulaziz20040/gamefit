# 1. Bosqich: Builder
FROM node:18-alpine AS builder

# Ishchi katalogni o‘rnatamiz
WORKDIR /app

# package.json va package-lock.json fayllarni nusxalab olamiz
COPY package*.json ./

# Bog‘liqliklarni o‘rnatamiz
RUN npm install

# Barcha fayllarni konteynerga nusxalaymiz
COPY . .

# Next.js loyihasini build qilamiz
RUN npm run build

# 2. Bosqich: Production image
FROM node:18-alpine

# Ishchi katalog
WORKDIR /app

# Faqat kerakli fayllarni copy qilamiz
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Agar sizda custom server.js bo‘lsa:
# COPY --from=builder /app/server.js ./server.js

# Default port
EXPOSE 3000

# Start komandasi
CMD ["npm", "start"]