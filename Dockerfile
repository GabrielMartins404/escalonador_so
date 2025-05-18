# Etapa de build
FROM node:20-alpine AS build

WORKDIR /app/view

COPY view/package*.json ./
RUN npm install
COPY . /app
RUN npm run build

# Etapa de produção
FROM nginx:stable-alpine AS production

RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Vite
COPY --from=build /app/view/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
