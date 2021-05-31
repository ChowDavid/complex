FROM node:alpine
WORKDIR '/app'
COPY ./package.json .
RUN npm install
COPY . .
ENV CI=true
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/defaul.conf
COPY --from=0 /app/build /usr/share/nginx/html
