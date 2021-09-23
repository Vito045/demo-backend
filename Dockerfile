FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 4000
# CMD [ "IP_ADDRESS=0.0.0.0", "node", "server.js" ]
CMD [ "node", "server.js" ]