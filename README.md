# Teamway Challenge Task Server App

## Introduction

This is application was developed as a challenge it's the backend app devloped using the following tecnologies

    * nodejs
    * lowdb
    * lodash
    * nanoid
    * jest

The app provides a REST API which wrapps the access the lowdb which is lighweight JSON database that can operate just in memory. 

This database has an initial file where the quiz questions are stored, the app will provide access to teh questions and also manage session records to provide a way to store the quiz results, the goal was to expand the access and align with the CRUD model.

## REST API Methods used

### get('/query?current=<question-id>')

This method will return the question record, if question-id has a valid value.

### post('/result', {<optional-data>})

Post method on result path will create a new session record, if there is optional data it will be include on the record it will then return session-id for updat  or delete operations. 

### put('/result', {sid: <session-id>, ...{result-data}})

Put method will update the the session record, if session-id is valid, with the data provided by the client side.

### delete('/result?sid=<session-id>')

Delete method will remove the record from the DB, is session-id can be found.

## Project Setup

 npm install

 ## Run Project

node index.js

 ## Unit tests

 npm run tests

 ## Containers use

 Dockerfile can be used to generate a container,port 3000 should be exposed to allow the client access.