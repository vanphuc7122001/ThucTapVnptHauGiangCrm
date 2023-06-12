const { Permission, Role_Permission, Role, Task_Employee } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 2) {
        const { taskId, employeeId } = req.body;
        const permissions = await Task_Employee.findAll();
        for (let value of permissions) {
            if (value.taskId == taskId && value.employeeId == employeeId) {
                return res.send({
                    error: true,
                    msg: `Đã tồn tại quyền ${value.name}.`,
                });
            }
        }
        try {
            const document = await Task_Employee.create({
                taskId: taskId,
                employeeId: employeeId,
            });
            return res.send({
                error: false,
                msg: `Bạn đã tạo thành công quyền ${document.name}`,
                document,
            });
        } catch (error) {
            console.log(error.message);
            return res.send({
                error: true,
                msg: error.message,
            });
        }
    } else {
        return res.send({
            error: true,
            msg: `Vui lòng nhập đủ thông tin.`,
        });
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Task_Employee.findAll({
            include: [
                Permission,
                Role,
            ]
        });
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(createError(400, "Error finding all permissions!"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const documents = await Task_Employee.findOne({
            where: {
                _id: req.params.id,
            },
        });
        return res.send(documents);
    } catch (error) {
        return next(createError(400, "Error finding permission !"));
    }
};