const { Customer_Types, Customer } = require('../models/index.model.js');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next) => {
    try {
        const document = await Customer.create({
            content: req.body.content,
            time_duration: req.body.time_duration,
        });
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error creating customer !')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Customer.findAll({
            include: Customer_Types,
        });
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error finding customers !')
        )
    }
}

exports.findOne = async (req, res, next) => {
    try {
        const documents = await Customer.findOne({
            where: {
                _id: req.params.id,
            }
        });
        return res.send(documents);
    } catch (error) {
        return next(
            createError(400, 'Error finding customer !')
        )
    }
}

exports.deleteOne = async (req, res, next) => {

}

exports.deleteAll = async (req, res, next) => {

}

exports.update = async (req, res, next) => {

}

