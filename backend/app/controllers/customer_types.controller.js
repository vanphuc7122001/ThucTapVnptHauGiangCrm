const { Customer_Types } = require('../models/index.model.js');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next) => {
    try {
        const document = await Customer_Types.create({
            name: req.body.name,
        });
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error creating customer types !')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Customer_Types.findAll();
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
        const documents = await Customer_Types.findOne({
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

