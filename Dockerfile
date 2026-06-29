# Serve the static app on Back4App Containers (nginx, port 80)
FROM nginx:1.27-alpine

# Replace the default server block so OPTIONS health-check probes return 200
# (otherwise nginx returns 405 and Back4App marks the container unhealthy).
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the site into nginx's web root.
# index.html is the unit lookup app. Drop depot-train-locations.html in this
# folder too and it will be served at /depot-train-locations.html.
COPY *.html /usr/share/nginx/html/

EXPOSE 80
# nginx:alpine starts nginx in the foreground by default.
