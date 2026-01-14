# Use Node.js as the base image
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Install dependencies (only copy package files first for caching)
COPY frontend/package*.json ./
RUN npm install

# Copy Prisma schema first for better caching
COPY frontend/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY frontend/ .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=base /app/next.config.mjs ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]