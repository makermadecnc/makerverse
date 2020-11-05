FROM node:12
MAINTAINER Zane Claes <zane@technicallywizardry.com>

# Install global dependencies
RUN apt-get update -y && \
  apt-get install --no-install-recommends -y \
    python-pip git curl make g++ udev && \
  apt-get -y autoclean

# Install Docker, for access within the container.
RUN curl -sSL https://get.docker.com | sh
RUN usermod -aG docker node

# Create user to run the application
USER node
WORKDIR /home/node

# -------- Application Code ---------
# note: add any sensitive or large files to .dockerignore
ADD --chown=node:node . /home/node

# The node_modules are intentionally excluded by .dockerignore.
# Some modules have architecture-dependent install candidates, which are resolved here.
RUN npm install -g yarn
RUN yarn install

EXPOSE 8000
ENTRYPOINT ["/home/node/bin/docker-entrypoint"]
