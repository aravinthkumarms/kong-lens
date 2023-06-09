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

# build the folder
RUN npm run build

# Handle Nginx
FROM nginx:latest
COPY --from=builder /app/src/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80