FROM node:18

# Create app directory

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN yarn install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000
EXPOSE 5555

# Build app
RUN yarn build

# Run app
CMD npx prisma migrate deploy && npx prisma generate &&  yarn start 


# Path: docker-compose.yml


