FROM node:14.15.1-alpine
WORKDIR /app/client
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . ./