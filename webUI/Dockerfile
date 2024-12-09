# Stage 1: Build Angular App
FROM node:lts-alpine3.20 AS build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build --prod

# Stage 2: Serve the app with NGINX
FROM nginx:stable-alpine3.20-perl
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/web-ui/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
