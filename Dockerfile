FROM node:12
MAINTAINER Zane Claes <zane@technicallywizardry.com>

# Install global dependencies
RUN apt-get update -y && \
  apt-get install --no-install-recommends -y \
    python-pip git curl make g++ udev && \
  apt-get -y autoclean

# Create user to run the application
USER node
WORKDIR /home/node

# -------- Application Code ---------
# note: add any sensitive or large files to .dockerignore
ADD --chown=node:node . /home/node

# Node: dev dependencies are required for "build-prod", so npm install does not use --production
# RUN npm install
# RUN npm run build-prod-server
# RUN npm run build-prod-app

EXPOSE 8000
CMD ["/home/node/bin/docker-entrypoint"]