FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Продакшн nginx
FROM nginx:alpine

COPY --from=build /app/dist/*your-project-name*/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
