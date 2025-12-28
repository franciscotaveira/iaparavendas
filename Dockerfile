FROM node:18-alpine

WORKDIR /app

# Instala dependências (com flag permissiva para evitar erros de peer deps)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copia o código fonte
COPY . .

# Exponha a porta
EXPOSE 3000

# Comando de dev (hot reload)
CMD ["npm", "run", "dev"]
