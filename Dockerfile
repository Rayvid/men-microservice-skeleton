FROM node:12.16
ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

ARG NPMRC_CONTENT="registry=https://npm.lympo.io/\n//npm.lympo.io/:_authToken=override_this_arg_in_host"
RUN printf "$NPMRC_CONTENT" > ~/.npmrc

RUN npm install --unsafe-perm
COPY . .

FROM node:12.16
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV:-production}"]
