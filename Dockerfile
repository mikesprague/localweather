FROM node:10

LABEL name="localweather-io-zeit-deploy"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm i -g yarn

RUN yarn

RUN yarn webpack:build
