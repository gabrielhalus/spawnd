# ---- Base image ----
  ARG BUN_VERSION=1.2.13
  FROM oven/bun:${BUN_VERSION}-slim AS base
  
  WORKDIR /app
  ENV NODE_ENV=production

# ---- Build stage ----
FROM base AS build

# Install dependencies for native packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential node-gyp pkg-config python-is-python3

    
# Copy full monorepo into image
COPY --link . .
    
# Install all workspace dependencies
RUN bun install --no-save

# ---- Final stage ----
FROM base

# Copy built app
COPY --from=build /app /app

# Expose port 3000
EXPOSE 3000

# Start backend
CMD bun run --cwd=apps/backend scripts/migrate.ts && bun run --cwd=apps/backend start
