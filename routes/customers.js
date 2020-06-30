const express = require('express');
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/', (req, res) => {
    const customers = Customer.find().sort('name');
    res.send(customers);
});


router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save(customer);
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(!error) return res.status(404).send(error.details[0].message);

    const customer = Customer.findByIdAndUpdate(req.param.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {new: true});

    if(!customer) return res.status(404).send('Customer does not exisst.');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(!error) res.status(404).send(error.details[0].message);

    const customer = Customer.findByIdAndRemove(req.param.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {new: true});

    if(!customer) return res.status(404).send('Customer does not exisst.');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.param.id);

    if(!customer) return res.status(404).send('Customer does not exists.');
    res.send(customers);
});

module.exports = router;
