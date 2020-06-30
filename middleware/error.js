const winston = require('winston');

module.exports = function(err, req, res, next){
    winston.error(err.message, {metadata: err });
    res.status(505).send('Something failed.');
}