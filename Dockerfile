FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn
COPY . .
RUN yarn tsc
EXPOSE 3333
CMD yarn start