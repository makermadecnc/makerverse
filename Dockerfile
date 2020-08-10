FROM debian:stretch
MAINTAINER Chris Skiles <chris@makermadecnc.com>

# Install global dependencies
RUN apt-get update -y && \
  apt-get install --no-install-recommends -y \
    python-pip git curl make g++ udev

# Install NVM
RUN git clone https://github.com/creationix/nvm.git /nvm && \
  cd /nvm && \
  git checkout `git describe --abbrev=0 --tags` && \
  chmod +x /nvm/nvm.sh && /nvm/nvm.sh

# Install Node 12
ENV NVM_DIR="/nvm"
RUN [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
  nvm install 12 && nvm use 12 && \
  npm i npm@latest -g

# Create user to run the application
RUN groupadd --gid 1000 makerverse \
    && useradd --uid 1000 --gid makerverse --shell /bin/bash --create-home makerverse
ADD . /home/makerverse
RUN chown -R makerverse:makerverse /home/makerverse
USER makerverse
WORKDIR /home/makerverse

# Switch to bash shell and enable NVM by default.
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' > /home/makerverse/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# n.b., --production fails due to missing binaries on arhmf
RUN npm install . && npm run prepare

# Prebuild dev mode too in case debug is enabled.
RUN npm run build-dev

EXPOSE 8000
CMD ["/home/makerverse/bin/docker-entrypoint"]