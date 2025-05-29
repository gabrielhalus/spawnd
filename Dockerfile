# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.2.13
FROM oven/bun:${BUN_VERSION}-slim AS base

# Bun app lives here
WORKDIR /app

# Set production mode
ENV NODE_ENV="production"


# Throw away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link bun.lock package.json ./
RUN bun install --ci

# Copy application code
COPY --link . .

# Final stage for app image
FROM base

# Copy build application
COPY --from=build /app /app

RUN bun run db:migrate

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD bun run db:migrate && bun run start
