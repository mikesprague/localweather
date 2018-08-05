FROM node:10

LABEL name="localweather-io-zeit-deploy"
LABEL version="0.19.6"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm i -g yarn
RUN yarn
RUN yarn build
RUN echo "Build complete."
RUN exit
