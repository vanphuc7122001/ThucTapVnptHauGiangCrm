const { Employee,Unit,Position, Department, Center_VNPTHG } = require('../models/index.model.js');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length >= 8) {
        const { name, birthday, address, phone, email, postionId, unitId } = req.body;
        const employees = await Employee.findAll();
        for (let value of employees) {
            if (value.name == name && value.phone == phone && value.email == email) {
                    return res.send({
                        error: true,
                        msg: `Đã tồn tại nhân viên.`
                    })
            }
        }
        try {
            const document = await Employee.create({
                name: req.body.name,
                birthday: req.body.birthday,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                postionId: req.body.postionId,
                unitId: req.body.unitId,
            });
            return res.send({
                error: false,
                msg: `Bạn đã tạo thành công nhân viên ${document.name}`,
                document: document,
            })
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
            msg: `Vui lòng nhập đủ thông tin.`
        })
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Employee.findAll({
            include: [
                {
                  model: Position,
                  attributes: ["_id","name"]
                },
                {
                  model: Unit,
                  attributes: ["_id","name"],
                  include: [
                      {
                        model: Department,
                        attributes: ["_id","name"],
                        include: [
                          {
                            model: Center_VNPTHG,
                            attributes: ["_id","name"]
                          }
                      ]
                      }
                  ]
                }
            ]
        });
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error finding employees !')
        )
    }
}

exports.findOne = async (req, res, next) => {
    try {
        const documents = await Employee.findOne({
            where: {
                _id: req.params.id,
            },
            include: [
                {
                  model: Position
                },
                {
                    model: Unit,
                    include: [
                        {
                          model: Department,
                          include: [
                            {
                              model: Center_VNPTHG,
                            }
                        ]
                        }
                    ]
                }
            ]
        });
        return res.send(documents);
    } catch (error) {
        return next(
            createError(400, 'Error finding employee !')
        )
    }
}

exports.deleteOne = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({
            where: {
                _id: req.params.id,
            }
        });
        const document = await Employee.destroy({
            where: {
                _id: req.params.id,
            },
            returning: true,
        });

        return res.send({
            msg:` Đã xoá thành công nhân viên ${employee.name}`,
            document: employee,
        });
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Error deleteOne')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    // try {
    //     const documents = await Employee.destroy({ where: {} });
    //     return res.send(Đã xóa.);
    // } catch (error) {
    //     return next(createError(400, "Error delete employees !"));
    // }
}

exports.update = async (req, res, next) => {
    console.log('update', req.body);
    const { name, birthday, address, phone, email, postionId, unitId } = req.body;
    try {
        let employees = [await Employee.findOne({
            where: {
                _id: req.params.id,
            }
        })];

        employees = employees.filter(
            (value, index) => {
                return value.name == name && value.birthday == birthday && value.address == address 
                && value.phone == phone && value.email == email && value.postionId == postionId && value.unitId == unitId;
            }
        )

        if (employees.length == 0) {
            const document = await Employee.update({
                name: req.body.name,
                birthday: req.body.birthday,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                postionId: req.body.postionId,
                unitId: req.body.unitId
            }, { where: { _id: req.params.id }, returning: true, });
            return res.send({
                error: false,
                msg: 'Dữ liệu đã được thay đổi thành công.',
            })
        } else {
            return res.send({
                error: true,
                msg: 'Dữ liệu chưa được thay đổi.',
            })
        }

    } catch (error) {
        return next(
            createError(400, 'Error update')
        )
    }
}