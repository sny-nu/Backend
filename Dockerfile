FROM node:12-alpine as base

WORKDIR /srv

#copy package.json
COPY package*.json /srv/

# Copy source files
COPY . /srv/

RUN npm install && chown -R node:node /srv ;

# Use a specific user.  TODO: Create a new one with specific rights??
USER node

RUN npm run build

EXPOSE 4000
CMD npm run start:prod
