# Stage 1: Build the Flutter web app
FROM cirrusci/flutter:stable AS build

WORKDIR /app

# Copy the flutter app into the container
COPY ./flutter_app /app

# Run flutter pub get
RUN flutter pub get

# Build the flutter web app
RUN flutter build web

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/build/web /usr/share/nginx/html
