FROM node:10.13
ARG ENV=production
ENV NODE_ENV=$ENV
ARG NPMRC_CONTENT="//registry.npmjs.org/:_authToken=override_this_arg_in_host"

RUN printf "$NPMRC_CONTENT" > ~/.npmrc
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

RUN npm install --unsafe-perm
# Building bcrypt otherwise having binary compatibility issues with alpine sometimes
RUN npm rebuild bcrypt --build-from-source
COPY . .

FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV}"]
