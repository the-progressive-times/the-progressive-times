# MEAN Starterkit
A starterkit for developing projects using the MEAN Stack and other technologies

## Techologies
- **MongoDB**: MongoDB is used for storing users, threads, replies, blogs, etc. MongoDB is the obvious choice when working with Node.js

- **Mongoose**: Mongoose is a MongoDB wrapper that introduces schematics and provides helpful functions when working with the database.

- **Express**: I'm using Express for routing. If I used purely Node.js to route, this project would be much larger. Express is the natural choice when working with Node.js.

- **AngularJS**: AngularJS is being used as my front-end framework. 

- **Node.js**: This piece of technology is being used as my server. Thanks node.

- **Compass**: SASS allows support for nesting, functions, and variables in CSS.

- **Karma/Jasmine**: I am using Jasmine to test and Karma as the test runner.

- **Material Design**: I am using the Angular Material framework for the majority of styling.

##Features
- **Front End**:
    - **Profile Page**: When a user registers, they are given a profile page. From there they can edit their username, full name, and email.
    - **Members Page**: This page displays a list of all registered users.
    - **Material Design**: Website is beautifully styled using material design. It is also 100% responsive on all screen sizes.
- **Back End**:
    - **Passport**: Registration and Login is handled using Passport. For now, only the local strategy is used. 
    - **Token Authentication**: To protect a route, you can add authentication middleware as demonstrated in the index.js file. Users must provide a valid token.
    - **Correctly Done Encryption**: Security is taken seriously. Crypto is used to hash passwords with a unique salt. Even if someone gains access to the database they will never be able to decrypt the passwords.


## Installation
If you'd like to spin up your own server, follow these instructions:

`git clone https://github.com/yeager-j/mean-starter`

`cd mean-starter`

`npm install`

`node bin/www`

Open your browser and connect to `http://localhost:3000`