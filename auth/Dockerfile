FROM node:alpine
ENV PORT=3000
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .
CMD npm start