FROM bitnami/node:16
ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

ARG NPMRC_CONTENT="//registry.npmjs.org/:_authToken=pass_this_arg_if_need_to_access_private_packages\n"
RUN printf "$NPMRC_CONTENT" > ~/.npmrc

RUN npm install
COPY . .

# Start fresh from lighweight image and transfer files build in prev step (helps to keep it minimal and not expose registry token and other secrets used in build)
FROM bitnami/node:16-prod
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
# Thats default port, but to change it you need to do it in multiple places. TODO figure out how to make it DRY
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV:-production}"]
