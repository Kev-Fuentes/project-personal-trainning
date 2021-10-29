FROM node:14-alpine
ENV PORT = 4000
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
CMD [ "npm", "start" ]