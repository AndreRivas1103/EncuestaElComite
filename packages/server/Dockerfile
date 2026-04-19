FROM node:20-alpine

WORKDIR /app

# Instala dependencias del workspace y del backend
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
RUN npm ci --workspace @encuestaelcomite/server --include-workspace-root

# Copia el código del backend
COPY packages/server ./packages/server

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "@encuestaelcomite/server"]
