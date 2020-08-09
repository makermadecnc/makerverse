FROM debian:stretch
MAINTAINER Chris Skiles <chris@makermadecnc.com>

# Install global dependencies
RUN apt-get update -y && \
  apt-get install --no-install-recommends -y \
    python-pip git curl make g++ udev

# Install NVM & Node 10
RUN git clone https://github.com/creationix/nvm.git /nvm && \
  cd /nvm && \
  git checkout `git describe --abbrev=0 --tags` && \
  chmod +x /nvm/nvm.sh && /nvm/nvm.sh

ENV NVM_DIR="/nvm"
RUN [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
  nvm install 10 && nvm use 10 && \
  npm i npm@latest -g

RUN groupadd --gid 1000 makerverse \
    && useradd --uid 1000 --gid makerverse --shell /bin/bash --create-home makerverse
ADD . /home/makerverse
RUN chown -R makerverse:makerverse /home/makerverse
USER makerverse
WORKDIR /home/makerverse

RUN [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    npm install . && npm run prepare
# n.b., --production fails due to missing binaries on arhmf

EXPOSE 8000
CMD ["/home/makerverse/bin/docker-entrypoint"]
