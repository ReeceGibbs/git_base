/**
 * this is the entry point of our application
 * we will start our server from here instead of our app.js for testing purposes
 * https://dev.to/ericchapman/nodejs-express-part-5-routes-and-controllers-55d3
 * https://zellwk.com/blog/endpoint-testing/
 */
const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));