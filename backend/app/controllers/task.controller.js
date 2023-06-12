const { Task, Appointment, Employee, Cycle, Customer, Status_Task } = require('../models/index.model.js');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next) => {
    console.log(req.body);
    if (Object.keys(req.body).length === 6) {
        const { start_date, end_date, content, cycleId, customerId, leaderId } = req.body;
        const tasks = await Task.findAll();
        for (let value of tasks) {
            if (value.customerId == customerId && value.leaderId == leaderId && value.start_date == start_date && value.end_date == end_date) {
                return res.send({
                    error: true,
                    msg: `Khách hàng đã được phân công.`
                })
            }
        }
        try {
            const document = await Task.create({
                start_date: start_date,
                end_date: end_date,
                content: content,
                cycleId: cycleId,
                customerId: customerId,
                leaderId: leaderId,
            });

            const sta_task = await Status_Task.create({
                status: "false",
                reason: "Cập nhật",
                TaskId: document._id,
            });
            
            return res.send({
                error: false,
                msg: `Tạo phân công thành công`,
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
    // try {
    //     const document = await Task.create({
    //         start_date: req.body.start_date,
    //         end_date: req.body.end_date,
    //         content: req.body.content,
    //         cycleId: req.body.cycleId,
    //         customerId: req.body.customerId,
    //         leaderId: req.body.leaderId,
    //     });
    //     return res.send(document);
    // } catch (error) {
    //     console.log(error);
    //     return next(
    //         createError(400, 'Error creating task!')
    //     )
    // }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Task.findAll({
            include: [{
                model: Status_Task,
                // attribute: ['status','reason']
            },
            {
                model: Customer,
            },
            {
                model: Employee,
            },
            {
                model: Cycle,
            },
            {
                model: Appointment,
            },
            ]

        });
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(
            createError(400, 'Không tìm thấy phân công!')
        )
    }
}

exports.findOne = async (req, res, next) => {
    try {
        const documents = await Task.findOne({
            where: {
                _id: req.params.id,
            },
            include: [{
                model: Status_Task,
                // attribute: ['status','reason']
            },
            {
                model: Customer,
            },
            {
                model: Employee,
            },
            {
                model: Cycle,
            },
            ]
        });
        return res.send(documents);
    } catch (error) {
        return next(
            createError(400, 'Không tìm thấy phân công !')
        )
    }
}

exports.deleteOne = async (req, res, next) => {
    try {
        const documents = await Task.destroy({
            where: {
                _id: req.params.id,
            }
        });
        return res.send(`Đã xóa phân công`);
    } catch (error) {
        return next(createError(400, "Lỗi không xóa được phân công !"));
    }
}

exports.deleteAll = async (req, res, next) => {
}

// exports.update = async (req, res, next) => {
//     console.log('update', req.body);
//     //const { start_date, end_date, content, cycleId, customerId, leaderId} = req.body;
//     try {
//         let tasks = [await Task.findOne({
//             where: {
//                 _id: req.params.id,
//             },
//             include: [{
//                 model: Status_Task,
//                 attribute: ['status','reason'],
//             }]
//         })];

//         tasks = tasks.filter(
//             (value, index) => {
//                 return value.start_date == req.body.start_date && value.end_date == req.body.end_date && value.content == req.body.content 
//                 && value.cycleId == req.body.cycleId && value.customerId == req.body.customerId && value.leaderId == req.body.leaderId 
//                 && value.status == req.body.Status_Task.status && value.reason == req.body.Status_Task.reason;
//             }
//         )

//         if (tasks.length == 0) {
//             console.log(req.body)
//             const document = await Task.update({
//                 start_date: req.body.start_date,
//                 end_date: req.body.end_date,
//                 content: req.body.content,
//                 cycleId: req.body.cycleId,
//                 customerId: req.body.customerId,
//                 leaderId: req.body.leaderId,
//             }, 
//             { 
//                 where: { _id: req.params.id },
//                 // include: [{
//                 //     model: Status_Task,
//                 //     attribute: ['status','reason'],
//                 // }] 
//             });
//             const sta_tasks = await Status_Task.update({
//                 status: req.body.Status_Task.status,
//                 reasons: req.body.Status_Task.reason,
//             }, {where: {TaskId: document._id},});
//             return res.send({
//                 error: false,
//                 msg: 'Dữ liệu đã được thay đổi thành công.',
//             })
//         } else {
//             return res.send({
//                 error: true,
//                 msg: 'Dữ liệu chưa được thay đổi.'
//             })
//         }

//     } catch (error) {
//         return next(
//             createError(400, 'Error update')
//         )
//     }
// }

exports.update = async (req, res, next) => {
    console.log('update', req.body);
    console.log(req.body.Status_Task.status);
    console.log(req.body.Status_Task.reason);
    const { start_date, end_date, content, cycleId, customerId, leaderId } = req.body;
    try {
        let tasks = [await Task.findOne({
            where: {
                _id: req.params.id,
            },
            include: [{
                model: Status_Task,
                attribute: ['status', 'reason'],
            }]
        })];

        tasks = tasks.filter(
            (value, index) => {
                return value.start_date == start_date && value.end_date == end_date && value.content == content
                    && value.cycleId == cycleId && value.customerId == customerId && value.leaderId == leaderId
                    && value.reason == req.body.Status_Task.reason && value.status == req.body.Status_Task.status;
            }
        )

        if (tasks.length == 0) {
            const document = await Task.update({
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                content: req.body.content,
                cycleId: req.body.cycleId,
                customerId: req.body.customerId,
                leaderId: req.body.leaderId,
            }, { where: { _id: req.params.id }, returning: true, });


            console.log(req.body.Status_Task.status);
            console.log(req.body.Status_Task.reason);
            console.log(document);
            console.log(req.params.id);
            const sta_tasks = await Status_Task.update({
                status: req.body.Status_Task.status,
                reason: req.body.Status_Task.reason,
            }, { where: { TaskId: req.params.id }, returning: true, });
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




