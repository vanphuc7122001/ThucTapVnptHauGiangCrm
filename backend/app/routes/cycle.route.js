const express = require('express');
const customers = require('../controllers/customer.controller');

const router = express.Router();

router.route('/')
    .post(customers.create)
    .get(customers.findAll)
    .delete(customers.deleteAll)

router.route('/:id')
    .put(customers.update)
    .get(customers.findOne)
    .delete(customers.deleteOne)

module.exports = router;

