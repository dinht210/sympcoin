FROM node:18-alpine 

WORKDIR /sympcoin/

COPY public/ /sympcoin/public
COPY src/ /sympcoin/src
COPY package.json /sympcoin/

RUN npm install web3

CMD ["npm", "start"]



