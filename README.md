### **BLOCK APP**
#### Access your student schedule for anywhere. 

##### PROBLEM/SOLUTION
A scheduling app that lets users(students) choose their class schedule for the semester. 

##### BLOCK Overview
* server.js (Sets up our app to use express and to listen at a port.)
* package.json
* package-lock.json
* config
  * config.json file created by sequelize
* controllers
  * classes_controller.js (Routes our functionality)
* models
  * db (Database using MySQL)
  * allData.js (Sequelize model for allData data.)
  * classes.js (Sequelize model for classes data).
  * index.js (Boiler plate Sequelize file.)
  * students.js (Sequelize model for students)
  * subjects.js (Sequelize model for subjects)
* public
  * assets
    * css
      * style.css (Main stylesheet.)
      * reset.css (Resets any style that the browser might have preloaded.)
      * styles
        * timetablejs.css (styling for the timetable.)
    * img (All images used in project.)
    * js
      * app.js (Runs the click functionality of the app.)
    * scripts
      * timetable.js (Library import for the timetable logic.)
* views
  * index.handlebars (Dynamically holds html for use in the main file.)
  * layouts
    * main.handlebars (The layout that our index.handlebars references.)

##### Instructions to Run the App
* Hosted on Heroku here: https://quiet-oasis-29575.herokuapp.com/

* OR clone the file from github. (https://github.com/emmastotz/project-2)
* Install all dependencies needed to run the program ("npm install").
* Run the applications using node in the command line ("node server.js") and open up browser with correct port to see the magic.

##### Technologies Used
* CSS3
* Bootstrap 4
* JavaScript/JQuery
* Timetable.js
* MySQL 
* Node
* NPMs: Express, Handlebars, Sequelize, Sequelize-cli

This app was created by Andy Tran, Alex Simuro, Emma Stotz, Juan Munoz and Sandy Enow