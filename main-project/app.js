/**
 * we will host our gitbase api from here
 * we will export our app module at the end of the file which will be started from the index.js file
 */
const helmet = require('helmet');
const express = require('express');
const app = express();
const gitbase_routes = require('./routes/gitbase');

/**
 * here we tell our express app to expect and parse json data
 * we also load our gitbase routing module and export our app module for testing
 */
app.use(express.json());
app.use('/gitbase', gitbase_routes);
app.use(helmet);

/**
 * a bit of middleware to handle invalid json request bodies
 */
app.use((error, request, response, next) => {
    /**
     * here we check for json syntax errors and return appropriate responses instead 
     * of just throwing errors
     */
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.log(`error @: ${request.url} JSON body syntax error`);
        return response.status(400).send('Error: 400 Bad Request - JSON payload incorrect format');
    }

    next();
});

/**
 * quick route handler to handle any invalid resource requests
 */
app.all('*', (request, response) => {
    console.log(`missing resource @: ${request.url} - returning 404`);
    response.status(404).send('Error: 404 Not Found');
});

module.exports = app;