FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/
RUN cd /usr/share/nginx/html && rm -f Dockerfile nginx.conf .dockerignore .DS_Store && find . -name '.DS_Store' -delete
