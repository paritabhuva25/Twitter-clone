FROM node:6-alpine

RUN mkdir -p /twitter-clone-3

ADD ./package.json /twitter-clone-3/package.json

WORKDIR /twitter-clone-3/
RUN npm install

ADD ./ /twitter-clone-3

#Comando que inicia
CMD [ "node", "app" ]
