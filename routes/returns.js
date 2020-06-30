const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');
const moment = require('moment');
const {Movie} = require('../models/movie');
const Joi = require('joi');

router.post('/', auth, async (req, res, next) => {
    const { error } = validateReturn(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });
    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('Returned already processed');

    rental.dateReturned = new Date();
    rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: {numberInStock: 1}
    });
     
    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
      customerId: Joi.ObjectId().required(),
      movieId: Joi.ObjectId().required()
    };
  
    return Joi.validate(req, schema);
}

module.exports = router;