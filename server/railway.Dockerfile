# Image used by Railway (selected with the RAILWAY_DOCKERFILE_PATH variable).
# The root Dockerfile is the school template's: Alpine-based, where argon2
# cannot build, and without a build or start step.
# Build context: the repository root.
FROM node:22-slim

WORKDIR /app

# Install dependencies first so this layer is cached between deploys.
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci

COPY . .

# Builds the React client into client/dist, served by Express.
RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]
