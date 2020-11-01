# RulesMS
----------
**RulesMS** is a Business rules versioning and deployment manager. A MERN fullstack web app
For a live demo check-out [here](https://rules-ms.herokuapp.com/)

### Based on: 
**Boss Starter**, an admin dashboard template, and **React Boilerplate**, the second official react boilerplate! It provides you clean modern design and high performance react app with various color theme. This template has been built to makes the development process easy and fast for you, which is supported by material-ui v3.x, jss (css in js), immutable js, webpack, npm modern workflow and flexible layout with flexbox.

## Extended!
The above boilerplate setup has been extended with:

-   async state functionality, at the frontEnd, by using **Redux-Thunk** 
-   a backend API which is connected directly with the frontend state and written in **node.js** and **Express.js**
-   connecting backend API with **MongoDB Atlas**

Thus, RulesMS is a fullstack **MERN** app! 

### Template & Boilerplate Features

-   Built with one of most popular javascript library React.JS and Redux
-   Use Google Material Design and Icons
-   Easy to manage data collection with immutable.js
-   Written in ES6 / ES 2015
-   Responsive design
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

### License
This project is licensed under the terms of the [MIT license](https://github.com/ilhammeidi/boss-lite/blob/master/LICENSE.txt).


 
