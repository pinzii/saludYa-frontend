# Capa 1: Construcción de artefactos de Angular
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build -- --configuration=production

# Capa 2: Servidor Nginx ultra-ligero para producción
FROM nginx:alpine
COPY --from=build /app/dist/salud-ya/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]