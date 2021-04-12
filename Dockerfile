FROM node:latest 

COPY . /web

WORKDIR /web

RUN yarn install
RUN yarn build


CMD ["sh", "-c", "yarn run start:prod"]