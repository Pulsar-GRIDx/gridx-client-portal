FROM node:18-alpine

WORKDIR /GRIDX-CLIENT-PORTAL/

COPY public/ /GRIDX-CLIENT-PORTAL/public
COPY src/ /GRIDX-CLIENT-PORTAL/src
COPY package.json /GRIDX-CLIENT-PORTAL/

RUN npm install

CMD ["npm", "start"]