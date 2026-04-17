FROM node:18

WORKDIR /app

# Copiar todo el monorepo
COPY . .

# Instalar dependencias del workspace
RUN npm install

# Ir al frontend
WORKDIR /app/packages/client

EXPOSE 3000

CMD ["npm", "run", "dev"]