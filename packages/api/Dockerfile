# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY tsconfig*.json ./
COPY src ./src
RUN pnpm build
RUN pnpm prune --prod

# --- run ---
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

COPY --chown=app:app entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER app
ENV NODE_ENV=production PORT=3000
EXPOSE 3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node","dist/index.js"]
