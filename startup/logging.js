require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
    //below event is for sync exceptions
    winston.exceptions.handle(new winston.transports.File({
        filename: 'unhandledException.log'
    }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    const dbHostUrl = 'mongodb://localhost/vidly';
    const level = 'info';
    winston.add(new winston.transports.Console({level: level, format: winston.format.printf((info) => { return info.level + ': ' + info.message})}));
    winston.add(new winston.transports.File({ filename: 'logfile.log', level: level, format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()) }));
    //winston.add(new winston.transports.MongoDB({db: dbHostUrl, level: level, options: {useNewUrlParser: true, useUnifiedTopology: true}}));
}