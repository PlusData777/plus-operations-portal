FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

COPY . .

RUN rm -rf .next \
    && npm install -g corepack@latest \
    && corepack pnpm install --frozen-lockfile \
    && corepack pnpm run build \
    && mkdir -p .next/standalone/.next \
    && cp -R .next/static .next/standalone/.next/static

CMD ["node", ".next/standalone/server.js"]
