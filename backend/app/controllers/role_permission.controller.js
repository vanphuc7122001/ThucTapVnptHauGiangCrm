const { Permission, Role_Permission, Role } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 2) {
        const { RoleId, PermissionId } = req.body;
        const permissions = await Role_Permission.findAll();
        for (let value of permissions) {
            if (value.RoleId == RoleId && value.PermissionId == PermissionId) {
                return res.send({
                    error: true,
                    msg: `Đã tồn tại quyền ${value.name}.`,
                });
            }
        }
        try {
            const document = await Role_Permission.create({
                RoleId: RoleId,
                PermissionId: PermissionId,
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
        const documents = await Role_Permission.findAll({
            include: [
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
        const documents = await Role_Permission.findOne({
            where: {
                _id: req.params.id,
            },
        });
        return res.send(documents);
    } catch (error) {
        return next(createError(400, "Error finding permission !"));
    }
};