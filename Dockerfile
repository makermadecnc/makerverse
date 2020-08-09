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

RUN groupadd --gid 1000 cncjs \
    && useradd --uid 1000 --gid cncjs --shell /bin/bash --create-home cncjs
ADD . /home/cncjs
RUN chown -R cncjs:cncjs /home/cncjs
USER cncjs
WORKDIR /home/cncjs

RUN [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    npm install --production . && npm run prepare

EXPOSE 8000
CMD ["/home/cncjs/bin/docker-entrypoint"]
