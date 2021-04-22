# RulesMS
----------
**RulesMS** is a Business rules versioning and deployment manager. A **MERN** fullstack web app.
For a live demo check-out [here](https://rules-ms.herokuapp.com/)

### Based on: 
**Boss Starter**, an admin dashboard template<sup>1</sup>, and **React Boilerplate**, the second official react boilerplate<sup>2</sup>, a highly scalable, offline-first foundation with the best developer experience and a focus on performance and best practices.

## Extended!
The above boilerplate setup has been enhanced with:

-   async state functionality, at the frontEnd, by using **Redux-Thunk** 
-   a proxy reaching to a dedicated service API  
-   connecting backend API with **MongoDB Atlas**
-   a lightweight webpack solution: a **webpack 4!** dev-webserver decoupled from the prod-webserver

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
 - Finally run the app.
	 `npm start`
 - Navigate to  [http://localhost:8081](http://localhost:8081)

### Service API
Backend API is a seperate project as of #37. Please check out [here](https://github.com/OnepointConsultingLtd/themis-server)

### Deployment

 - First you need to build the production assets
    `npm run build`
 - Then start the app
    `npm run start:prod`
 - If you want run it in background you may try PM2 [https://www.npmjs.com/package/pm2]( https://www.npmjs.com/package/pm2) Then run this command:
    `node node_modules/.bin/cross-env NODE_ENV=production pm2 start server`
 - Navigate to  [http://localhost:8081](http://localhost:8081)

 ### Planned features
 - **Azure storage:** Integrate Azure storage at the end of deployment. Generated DSL files should land into an azure bucket to be later picked up for the rest of the compilation process.
 - **Rules bulk update:** The user should be able to select multiple rules in Manager page and edit tags, edit status or delete rules with one go
 - **Soft delete:** The user should be able to soft-delete rules instead of current hard-delete; for this, we need to introduce an extra field at the rule level, called deleted: true or hidden: true
 - **Rule validator:** Before saving the system should validate the rule syntax first.
 - **Tagging notification:** Show a notification, that when someone adds a tag to a rule, it lists all the generators it will become part of.
 - **Projects:** The system should allow for rules that belong to separate project to be separated. In the future a use should have explicit permissions to access rules that belong to a specific project.
 - **Favorite searches:** In the rules manager it should be possible to pin a search/filter as favourite so the user has quick an easy access to a preselected set of rules.
 - **Jar generator:** The system should be able to directly generate a jar on deployment.

#### References
- <sup>1</sup> : https://github.com/ilhammeidi/boss-starter
- <sup>2</sup> : https://github.com/react-boilerplate/react-boilerplate
- <sup>3</sup> : https://medium.com/swlh/what-is-dx-developer-experience-401a0e44a9d9 
