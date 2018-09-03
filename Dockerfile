FROM node:9.11

ARG ENV=production
ENV NODE_ENV=$ENV
ARG NPMRC_CONTENT="//registry.npmjs.org/:_authToken=override_this_arg_in_host"

RUN printf "$NPMRC_CONTENT" > ~/.npmrc
WORKDIR /app
COPY package*.json /app/

RUN npm install --unsafe-perm
RUN npm rebuild bcrypt --build-from-source
COPY . .

FROM node:9.11-alpine
WORKDIR /app
COPY --from=0 /app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV}"]
