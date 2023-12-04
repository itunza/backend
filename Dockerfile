FROM node:14.18.1
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
EXPOSE 5001
CMD ["npm", "run", "start"]
