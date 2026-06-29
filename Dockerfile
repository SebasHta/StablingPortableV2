# Serve the static lookup app on Back4App Containers (nginx, port 80)
FROM nginx:1.27-alpine

# Copy the site into nginx's web root.
# index.html is the unit lookup app. Drop depot-train-locations.html in this
# folder too and it will be served at /depot-train-locations.html.
COPY *.html /usr/share/nginx/html/

EXPOSE 80
# nginx:alpine already starts nginx in the foreground by default.
