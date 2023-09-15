## ------ Build phase 1
FROM node:16-alpine as builder

ARG NODE_ENV=production

# Setting Enviroment variables
ENV NPM_CONFIG_PRODUCTION false
ENV NODE_ENV ${NODE_ENV}

RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package* /app/
RUN npm install --legacy-peer-deps

# Copy this project and build
COPY . /app
RUN npm run build

## ------ Build phase 2
## Expose to the world
FROM nginx:alpine

COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
