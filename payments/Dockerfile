FROM node:alpine
ENV PORT=3000
ENV NODE_ENV=test
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .
CMD npm start