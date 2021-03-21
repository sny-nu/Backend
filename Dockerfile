FROM node:12-alpine as base

ARG DB_HOST
ARG DB_NAME
ARG DB_PASS
ARG DB_USER
ARG SITE_URL
ARG WEB_RISK_TOKEN
ARG REDIS_URL
ARG REDIS_QUEUE

RUN echo ${DB_HOST}

WORKDIR /srv

#copy package.json
COPY package*.json /srv/

# Copy source files
COPY . /srv/

RUN npm install && chown -R node:node /srv ;

# Use a specific user.  TODO: Create a new one with specific rights??
USER node

ENV DB_HOST=${DB_HOST}
ENV DB_USERNAME=${DB_USER}
ENV DB_PASSWORD=${DB_PASS}
ENV DB_DATABASE=${DB_NAME}
ENV GOOGLE_APPLICATION_CREDENTIALS=${WEB_RISK_TOKEN}
ENV SITE_URL=${SITE_URL}
ENV REDIS_QUEUE_NAME=${REDIS_QUEUE}
ENV REDIS_URL=${REDIS_URL}

RUN npm run build

EXPOSE 4000
CMD npm run start:prod
