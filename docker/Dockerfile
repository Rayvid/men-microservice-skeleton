FROM node:9.11

ADD ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host bitbucket.org\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

WORKDIR /app
COPY package*.json /app/
# Next sed statements are needed to be able to fetch other github repos during CI
RUN  sed -i -- 's/https:\/\/bitbucket.org\//git@bitbucket.org:/g' package.json
RUN  sed -i -- 's/git+https/git+ssh/g' package-lock.json
RUN npm install --unsafe-perm
COPY . .

VOLUME /app
VOLUME /app/node_modules

EXPOSE 3000
CMD ["/bin/sh", "-c", "npm start"]