FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "index.js"]
