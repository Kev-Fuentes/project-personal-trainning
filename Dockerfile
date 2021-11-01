FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN apk --update add redis 
RUN npm install
CMD ["npm", "start"]