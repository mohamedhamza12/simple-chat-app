# Simple Chat App

A simple full stack node.js chat application built with express, socket.io, and mongoose.

Currently it supports one big room, which all users share, and in which all users are admins.

[View live demo](https://nodejs-chat-app-demo.herokuapp.com/)

![Application Screenshot](https://raw.githubusercontent.com/mohamedhh/simple-chat-app/main/public/img/app-screen.png)

## Features
* Instantly send and receive messages on all open devices
* Clear all messages (deletes all messages for good for all users)
* Online users indicator
* Browser tab title new messages indicator
## Setup

To run the application locally: 
1. Clone the repository, then run `npm install` at the root directory to install dependencies. 
2. Open `config.js` file and edit the database connection string to your MongoDB url.
3. Create a .env file at the root directory and populate the following required properties with their respective values:
```
PORT=<your-port>
DB_USER=<your-database-user>
DB_PASS=<your-database-password>
```

## Usage
After the project's dependencies are installed, run `npm start` at the root directory. The application will then be running at `localhost:<your-port>`
