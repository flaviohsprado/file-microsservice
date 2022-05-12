FROM node:alpine

# diretório alvo
WORKDIR /usr/file-microsservice

COPY package*.json ./

# instalação de dependências
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN rm -rf /dist

RUN npm i -g @nestjs/cli

RUN yarn --immutable --immutable-cache --check-cache

COPY . .

# abrindo a porta 3001
EXPOSE 3001

# inicializando a API
CMD [ "yarn", "start:dev" ]