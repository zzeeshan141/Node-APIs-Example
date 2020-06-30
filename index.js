const winston = require('winston');
const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

//throw new Error('Somethinf failed durinf startup...');
//const p = Promise.reject(new Error('Something failed miserably'));
//p.then(() => console.log('Done'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;