FROM node:22.12.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npx","sequelize","db:migrate"]
CMD ["npm","run","dev"]