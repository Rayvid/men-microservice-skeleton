FROM node:12.18.3
ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

ARG NPMRC_CONTENT="//registry.npmjs.org/:_authToken=override_this_arg_in_host\n"
RUN printf "$NPMRC_CONTENT" > ~/.npmrc

RUN npm install --unsafe-perm
COPY . .

# Start fresh from clean image and just transfers files build in prev step (to not expose registry token)
FROM node:12.18.3
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV:-production}"]
