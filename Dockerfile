FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# strict-ssl off is only required because I'm running behind corporate firewall that injects custom CA
RUN yarn config set "strict-ssl" false && yarn install --production=true

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]