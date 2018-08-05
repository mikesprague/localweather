FROM node:10

LABEL name="localweather-io-zeit-deploy"
LABEL version="0.19.8"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm i -g yarn
RUN yarn install
RUN yarn build
RUN echo "Build complete." && exit
