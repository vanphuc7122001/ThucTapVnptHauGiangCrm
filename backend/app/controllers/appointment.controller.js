const { Appointment, Status_App } = require('../models/index.model.js');
const { DataTypes, Op } = require('sequelize');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

// checked
exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 3) {
        const { date_time, content, taskId } = req.body;
        const appointments = await Appointment.findAll();
        for (let value of appointments) {
            if (value.date_time == date_time && value.taskId == taskId) {
                return res.send({
                    error: true,
                    msg: `Đã tồn tại cuộc hẹn ${value.content} lúc ${value.date_time}.`
                })
            }
        }
        try {
            const document = await Appointment.create({
                date_time: date_time,
                content: content,
                taskId: taskId,
            });
            const status_task = await Status_App.create({
                AppointmentId: document._id,
                status: 'false',
                reason: 'no',
            })
            return res.send({
                error: false,
                msg: `Bạn đã tạo thành công cuộc hẹn ${document.content} lúc ${document.date_time}.`,
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
        const documents = await Appointment.findAll();
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
        const document = await Appointment.findOne({
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
        const appointment = await Appointment.findOne({
            where: {
                _id: req.params.id,
            }
        });
        const document = await Appointment.destroy({
            where: {
                _id: req.params.id,
            },
            returning: true,
        });

        return res.send({
            msg: `Đã xoá thành công cuộc hẹn ${appointment.content} lúc ${appointment.date_time}.`,
            document: appointment,
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
    const { date_time, content, taskId } = req.body;
    try {
        let appointments = [await Appointment.findOne({
            where: {
                _id: req.params.id,
            }
        })];

        appointments = appointments.filter(
            (value, index) => {
                return value.date_time == date_time && value.taskId == taskId;
            }
        )

        if (appointments.length == 0) {
            const document = await Appointment.update({
                date_time: date_time,
                content: content,
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
        console.log(error);
        return next(
            createError(400, 'Error update')
        )
    }
}





