FROM node:18.14.0 as prod

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./.eslintrc.json ./.eslintrc.json
COPY ./src ./src
COPY ./public ./public
RUN yarn install
RUN yarn build
EXPOSE 3000