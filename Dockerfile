FROM node:14-alpine
WORKDIR /app
ENV PORT=4000
ENV REDIS_HOST=redis-server
ENV REDIS_PORT=6379
ENV MONGO_HOST=mongo-server
ENV MONGO_PORT=27017
ENV MONGO_DATABASE=app-restaurant
ENV MONGO_USER=
ENV MONGO_PASSWORD=
ENV MONGO_REPLICASET=
ENV MONGO_SSL=0
ENV MONGO_AUTH_SOURCE=
ENV MONGO_CONNECTION_NAME=connection_mongo_1
ENV NODE_ENV=development
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 4000
CMD ["npm", "run" , "start:dev"]