FROM node:lts
WORKDIR /usr/src/app
COPY ./bff/package*.json ./
RUN npm install --omit=dev
COPY ./bff .
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "index.js"]
