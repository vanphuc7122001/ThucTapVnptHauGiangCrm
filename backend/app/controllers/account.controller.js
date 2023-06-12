const { Account } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { DataTypes, Op } = require("sequelize");

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 4) {
        const { EmployeeId, roleId, password, user_name } = req.body;
        const accounts = await Account.findAll();
        for (let value of accounts) {
            if (
                value.user_name == user_name
            ) {
                return res.send({
                    error: true,
                    msg: `Đã tồn tại tài khoản ${value.user_name}.`,
                });
            }
        }
        try {
            const document = await Account.create({
                user_name: user_name,
                password: password,
                roleId: roleId,
                EmployeeId: EmployeeId,
            });
            return res.send({
                error: false,
                msg: `Bạn đã tạo thành công tài khoản ${document.user_name}`,
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
        const documents = await Account.findAll({});
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(createError(400, "Error finding all accounts!"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const documents = await Account.findOne({
            where: {
                _id: req.params.id,
            },
        });
        return res.send(documents);
    } catch (error) {
        return next(createError(400, "Error finding account !"));
    }
};

exports.deleteOne = async (req, res, next) => {
    try {
        const account = await Account.findOne({
            where: {
                _id: req.params.id,
            },
        });
        const result = await Account.destroy({
            where: {
                _id: req.params.id,
            },
        });

        if (result === 0) {
            return next(createError(404, "Account not found"));
        }
        return res.send({
            msg: `Đã xoá thành công tài khoản ${account.user_name}`,
            document: account,
        });
    } catch (error) {
        console.log(error);
        return next(createError(400, "Error deleting account"));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const result = await Account.destroy({
            where: {},
            truncate: true, // Truncate the table to remove all records
        });

        if (result === 0) {
            // If no records were deleted, return an error
            // return next(createError(404, 'No accounts found'));
            return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
        }

        //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    } catch (error) {
        console.log(error);
        return next(createError(400, "Error deleting accounts"));
    }
};

// exports.update = async (req, res, next) => {
//   console.log('update', req.body);
//   try {
//     const { user_name, password, roleId, EmployeeId } = req.body;
//     const [updatedRowsCount, updatedRows] = await Account.update(
//       {
//         user_name,
//         password,
//         roleId,
//         EmployeeId,
//       },
//       {
//         where: {
//           _id: req.params.id,
//         },
//         returning: true, // Get the updated rows as the result
//       }
//     );

//     if (updatedRowsCount === 0) {
//       // If no records were updated, return an error
//       return next(createError(404, "Account not found"));
//     }

//     return res.send(updatedRows[0]); // Return the updated account
//   } catch (error) {
//     console.log(error);
//     return next(createError(400, "Error updating account"));
// //   }
// };
exports.update = async (req, res, next) => {
    console.log("Update", req.body);
    const { EmployeeId, roleId, password, user_name } = req.body;
    // Kiểm tra xem dữ liệu cần thiết có bị thiếu không
    if (!user_name || !password || !roleId || !EmployeeId) {
        return res.send({
            error: true,
            msg: "Vui lòng điền đầy đủ thông tin.",
        });
    }
    try {
        let accounts = [
            await Account.findOne({
                where: {
                    _id: req.params.id,
                },
            }),
        ];

        accounts = accounts.filter((value, index) => {
            return (
                value.user_name == user_name &&
                value.password == password &&
                value.roleId == roleId &&
                value.EmployeeId == EmployeeId
            );
        });

        if (accounts.length == 0) {
            const document = await Account.update(
                {
                    EmployeeId: req.body.EmployeeId,
                    roleId: req.body.roleId,
                    password: req.body.password,
                    user_name: req.body.user_name
                },
                { where: { _id: req.params.id }, returning: true }
            );
            return res.send({
                error: false,
                msg: "Dữ liệu đã được thay đổi thành công.",
            });
        } else {
            return res.send({
                error: true,
                msg: "Dữ liệu chưa được thay đổi.",
            });
        }
    } catch (error) {
        return next(createError(400, "Error update"));
    }
};