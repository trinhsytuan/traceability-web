FROM node:16-alpine3.17 as build-step
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev tzdata
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.26.2-alpine
RUN apk update && apk add tzdata
ENV TZ=Asia/Ho_Chi_Minh
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
