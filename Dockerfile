FROM node:10
MAINTAINER Chris Skiles <chris@makermadecnc.com>

ADD package.json package.json
RUN npm i npm@latest -g
RUN npm install --production

ADD . .
EXPOSE 8000
CMD ["bin/makerverse"]
