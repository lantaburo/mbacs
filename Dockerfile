FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S mbacs && adduser -S mbacs -G mbacs
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./
COPY src/api ./src/api
COPY src/domain.mjs ./src/domain.mjs
USER mbacs
EXPOSE 3000
CMD ["node", "src/api/server.mjs"]
