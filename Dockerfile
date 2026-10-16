# Use the official Node.js image as the base image
FROM node:24

# Create the working directory and give ownership to the node user
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Set the working directory inside the container
WORKDIR /usr/src/app

# Switch to node user before installing so node_modules is owned by uid 1000
USER node

# Copy package.json and yarn.lock with correct ownership
COPY --chown=node:node package*.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the source code
COPY --chown=node:node . .

# Default CMD is overridden per-service in docker-compose.yml
CMD ["yarn", "start"]
