### Chat App - Apollo server, squelize, mysql, react js

![Preview](preview.png?raw=true)

- Copy files inside config folder
- Edit with your configuration
- Create database with `utf8mb4_bin` collation to save reaction unicode
- Install all dependencies server `npm install` and client `cd client && npm install`
- Install npx globally `sudo npm install npx -g`
- Make sure that your database configuration is correct, then migrate the database `npx sequelize db:migrate`
- Run server and client in development mode `npm run start:dev`
