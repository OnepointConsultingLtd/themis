# RulesMS
----------
**RulesMS** is a Business rules versioning and deployment manager. A **MERN** fullstack web app.
For a live demo check-out [here](https://rules-ms.herokuapp.com/)

### Based on: 
**Boss Starter**, an admin dashboard template<sup>1</sup>, and **React Boilerplate**, the second official react boilerplate<sup>2</sup>, a highly scalable, offline-first foundation with the best developer experience and a focus on performance and best practices.

## Extended!
The above boilerplate setup has been extended with:

-   async state functionality, at the frontEnd, by using **Redux-Thunk** 
-   a backend API which is connected directly with the frontend state and written in **node.js** and **Express.js**
-   the backend setup serves both the static and the API under the same server instance 
-   connecting backend API with **MongoDB Atlas**

Thus, RulesMS is a fullstack **MERN** app! 

### Template & Boilerplate Features

-   Built with developers experience in mind too! High **DX factor**<sup>3</sup>: Hot reloading, npm modern workflow, dll dependency bundling offer a guaranteed developer experience!
-   Built with one of most popular javascript library React.JS and Redux + immutable.js!
-   Use Google Material Design and Icons
-   Easy to manage data and state-managment with immutable.js
-   Written in ES6 / ES 2015
-   Responsive design, flexible layout with flexbox
-   JSS (CSS in JS)
-   Clean code maintained by eslint

### Installation

 - Clone this project
 - Install module dependencies by run this script in terminal
    `npm install`
 - After finish downloading, then build Build Webpack DLL dependencies(If necessary).
	 `npm run build:dll`
 - Finally run the app.
	 `npm start`
 - Navigate to  [http://localhost:8081](http://localhost:8081)

### Deployment

 - First you need to build the production assets first
    `npm run build`
 - Then start the app
    `npm run start:prod`
 - If you want run it in background you may try PM2 [https://www.npmjs.com/package/pm2]( https://www.npmjs.com/package/pm2) Then run this command:
    `node node_modules/.bin/cross-env NODE_ENV=production pm2 start server`
 - Navigate to  [http://localhost:8081](http://localhost:8081)


#### Notes
- <sup>1</sup>: https://github.com/ilhammeidi/boss-starter
- <sup>2</sup>: https://github.com/react-boilerplate/react-boilerplate
- <sup>3</sup>: https://medium.com/swlh/what-is-dx-developer-experience-401a0e44a9d9 
