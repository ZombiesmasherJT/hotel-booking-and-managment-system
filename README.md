# Hotel Booking and managmnet system - step by step guide

This project contains a full stack hotel booking system tailored for solo traverlers and hotel staff

Link to video project demonstration https://youtu.be/VXE_SwAyU_4



## Folder structure

-/frontend-react.js frontend application
- /backend - Node.js and express backend
-hotel_booking.sql - database schema for MySQL


### Prerequisites

-node.js and npm installed
Mysql Server installed and running


### Login details 

ADMIN


  email: admin@example.com
  password: hotelmng


TEST USER


    email: testuser@example.com
    password: password123



### Frontend setup

1 navigate to the frontend folder

cd frontend

2 install dependencies

npm install

3 start the react app

npm start

app will run on local host port 3000 usually

### backend setup

1 navigate to the backend
cd backend

2 install dependencies

3 The .env file already included and contians JWT_SECRET

4 Start  the backend server


node index.js run this in the backend folder




server will run on port local host 3001



### database setup

1 open up mySQL commandline or GUI tool

run these

CREATE DATABASE hotel_booking;
USE hotel_booking;

3 Run the following to import the schema

source/path/to/hotel_booking.sql

Replace path/to witj the actual path to the .sql file.

edit db.js passoword with your own myswl root password. (password when installing mysql server )

### Troubleshooting

if the project doesnt run correctly or you see errors related to missing packages

1 delete the node_modules folders in both /frontend and /backend directories

2 then reinstall the dependencies by running the following in each folder

npm install

This will restore all the required packages using the package.Json files




### Author

Developed by Joshua Tite for the Ci601 Final year project
