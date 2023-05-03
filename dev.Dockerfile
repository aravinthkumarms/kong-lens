# get the base node image
FROM node:16.19.1-alpine3.17 as builder

# set the working dir for container
WORKDIR /app/src

# copy other project files
COPY package*.json ./

# Set prepare as empty
RUN npm set-script prepare ''

# install npm dependencies
RUN npm install --production --force

# copy other project files
COPY  . .

EXPOSE 3000

# Start the development server
CMD ["npm", "start"]