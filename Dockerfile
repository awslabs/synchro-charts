#########################
### build environment ###
#########################

# base image
FROM node:14 as builder

# set working directory
RUN mkdir /app
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN yarn install

# add app
COPY . /app

# build
# RUN yarn build --scope @synchro-charts/core

# working directory
WORKDIR /app/packages/synchro-charts

# expose port
EXPOSE 3333

CMD [ "yarn", "start" ]
