const { Event } = require('../models/index.model.js');
const { DataTypes, Op } = require('sequelize');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

// checked
exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 3) {
        const { content, time_duration, name } = req.body;
        const events = await Event.findAll();
        for (let value of events) {
            if (value.name == name && value.time_duration == time_duration) {
                return res.send({
                    error: true,
                    msg: `Đã tồn tại sự kiện ${value.name} trong ngày ${value.time_duration}.`
                })
            }
        }
        try {
            const document = await Event.create({
                name: name,
                content: content,
                time_duration: time_duration,
            });
            return res.send({
                error: false,
                msg: `Bạn đã tạo thành công sự kiện ${document.name} trong ngày ${document.time_duration}`,
                document: document,
            })
        } catch (error) {
            console.log(error.errors[0].message);
            return res.send({
                error: true,
                msg: error.errors[0].message
            });
        }
    } else {
        return res.send({
            error: true,
            msg: `Vui lòng nhập đủ thông tin.`
        })
    }
}

// checked
exports.findAll = async (req, res, next) => {
    try {
        const documents = await Event.findAll();
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error findAll !')
        )
    }
}

// checked
exports.findOne = async (req, res, next) => {
    try {
        const document = await Event.findOne({
            where: {
                _id: req.params.id,
            }
        });
        return res.send(document);
    } catch (error) {
        return next(
            createError(400, 'Error findOne')
        )
    }
}

exports.deleteOne = async (req, res, next) => {
    try {
        const event = await Event.findOne({
            where: {
                _id: req.params.id,
            }
        });
        const document = await Event.destroy({
            where: {
                _id: req.params.id,
            },
            returning: true,
        });

        return res.send({
            msg: `Đã xoá thành công sự kiện ${event.name} trong ngày ${event.time_duration}`,
            document: event,
        });
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error deleteOne')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {

    } catch (error) {

    }
}

exports.update = async (req, res, next) => {
    console.log('update', req.body);
    const { content, time_duration, name } = req.body;
    try {
        let events = [await Event.findOne({
            where: {
                _id: req.params.id,
            }
        })];

        events = events.filter(
            (value, index) => {
                return value.name == name && value.time_duration == time_duration && value.content == content;
            }
        )

        if (events.length == 0) {
            const document = await Event.update({
                time_duration: time_duration,
                content: content,
                name: name,
            }, { where: { _id: req.params.id }, returning: true, });
            return res.send({
                error: false,
                msg: 'Dữ liệu đã được thay đổi thành công.',
            })
        } else {
            return res.send({
                error: true,
                msg: 'Dữ liệu chưa được thay đổi.'
            })
        }

    } catch (error) {
        return next(
            createError(400, 'Error update')
        )
    }
}






