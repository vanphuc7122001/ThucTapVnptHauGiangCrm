const { Task, Appointment, Employee, Cycle, Customer, Status_Task, Employee_Task, Status_App, Position, Unit, Department, Center_VNPTHG, Evaluate, Comment, Customer_Types, Customer_Work, Company_KH, Habit, Event } = require('../models/index.model.js');
const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");

const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

const setEncrypt = (value) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
const getDecrypt = (name) => {
  if (name) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(name, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};

exports.create = async (req, res, next) => {
    console.log(req.body);
    if (Object.keys(req.body).length === 9) {
        const { start_date, end_date, content, cycleId, customerId, leaderId , note} = req.body;
        var StatusTaskId;
        var EvaluateId;
        const tasks = await Task.findAll();
        for (let value of tasks) {
            if (value.customerId == customerId && value.leaderId == leaderId 
                && value.start_date == start_date && value.end_date == end_date) {
                return res.send({
                    error: true,
                    msg: `Khách hàng đã được phân công.`
                })
            }
        }
        try {
            const status_tasks = await Status_Task.findAll()     
            var count = 0;
            console.log("chieu dai",status_tasks.length)
            if(status_tasks.length > 0){
                console.log("vaooooooooooo")
                for(let value of status_tasks){
                    // console.log("status task hahaha ", value.dataValues.name);
                    value.dataValues.name = getDecrypt(value.dataValues.name);
                    console.log("name",value.dataValues.name )
                    console.log("name ahhahahaha", value.dataValues.name,value.dataValues.name == "chưa chăm sóc");
                    if(value.dataValues.name == "chưa chăm sóc"){
                        console.log("kiem tra", value.dataValues.name);
                        StatusTaskId= value.dataValues._id;
                        console.log("id status_task hahaahha",StatusTaskId )
                        count = 0;
                        break;
                    }
                    else {
                        count = 1;
                    }
                }
                console.log("count kkkkkkk", count);
                if(count != 0){
                    const status_task = await Status_Task.create({
                        name: "chưa chăm sóc",
                    })
                    StatusTaskId = status_task._id;
                    console.log("status_task",status_task )
                }
                console.log("id status_task hahaahha",StatusTaskId )
                // console.log("status task", statusId);
            }
            else{
                const status_task = await Status_Task.create({
                    name: "chưa chăm sóc",
                })
                StatusTaskId = status_task._id;
                console.log("status_task",status_task )
            }
                    
            const evaluates = await Evaluate.findAll()
            console.log("chieu dai",evaluates.length)
            if(evaluates.length > 0){
                console.log("dooooooooo")
                var a = 0;
                for(let value of evaluates){
                    value.dataValues.star = getDecrypt(value.dataValues.star);
                    console.log("star rrrrr",value.dataValues.star )
                    console.log("star ahhahahaha", value.dataValues.star,value.dataValues.stare == "1 sao");
                    if(value.dataValues.star == "1 sao"){
                        EvaluateId = value.dataValues._id;
                        a = 0;
                        break;
                    }
                    else {
                        a=1;
                    }
                }
                console.log("a", a);
                if(a !=0){
                    const evaluate = await Evaluate.create({
                        star: "1 sao",
                    })
                    EvaluateId = evaluate._id;
                }
                console.log("id evaluate hahaahha",EvaluateId )
                console.log("evaluate", EvaluateId);
            }
            else{
                const evaluate = await Evaluate.create({
                    star: "1 sao",
                })
                EvaluateId = evaluate._id;
            }
            
            const document = await Task.create({
                start_date: start_date,
                end_date: end_date,
                content: content,
                cycleId: cycleId,
                customerId: customerId,
                leaderId: leaderId,
                note: note,
                StatusTaskId: StatusTaskId,
                EvaluateId : EvaluateId,
            });
            console.log("id", document._id);

            const comment = await Comment.create({
                content: "Chưa có đánh giá nào",
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
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Task.findAll({
            include: [
              {
                model: Employee,
                include: [
                  {
                    model: Position,
                  },
                  {
                    model: Unit,
                    include: [
                      {
                        model: Department,
                        include: [
                          {
                            model: Center_VNPTHG,
                          },
                        ],
                      },
                    ],
                  },
                  // Unit,
                ],
              },
              {
                model: Status_Task,
                // attribute: ['status','reason']
              },
              {
                model: Customer,
                include: [
                  {
                    model: Customer_Types,
                  },
                  {
                    model: Customer_Work,
                    include: [
                      {
                        model: Company_KH,
                      },
                    ],
                  },
                  {
                    model: Habit,
                  },
                  {
                    model: Event,
                  },
                ],
              },
              {
                model: Cycle,
              },
              {
                model: Appointment,
                include: [
                  {
                    model: Status_App,
                  },
                ],
              },
              {
                model: Evaluate,
              },
              {
                model: Comment,
              },
            ],
          });
        // console.log("chieu dai", documents.length);
        // for(let i =0; i< documents.length; i++){
        //     console.log("dl neeee",documents[i]);
        //     console.log("id neeee",documents[i]._id);
        //     documents[i].dataValues["Emloyees_Task"] = []
        //     console.log("document thuuuu",documents[i] )
        //     const task_employee = await Task.findOne({
        //         where: {
        //             _id:documents[i]._id
        //         },
        //     })
        //     console.log("task employee", task_employee._id);
        //     const employee1 = await Employee_Task.findAll({
        //         where: {
        //           TaskId: task_employee._id,
        //         },
        //       });
        //       console.log("employee1", employee1);
        //       task_employee.dataValues["Employees"] = [];
        //       console.log("task employee sauuuuu", task_employee);
        //       for (let i = 0; i < employee1.length; i++) {
        //         console.log("EID:", employee1[i].dataValues.EmployeeId);
        //         const employee = await Employee.findOne({
        //           where: { _id: employee1[i].dataValues.EmployeeId },
        //         });
        //         console.log("id position",employee.dataValues)
        //         const position = await Position.findOne({
        //             where: { _id: employee.dataValues.postionId },
        //           });
        //           console.log("id position",employee.dataValues)
        //         const unit = await Unit.findOne({
        //             where: { _id: employee.dataValues.unitId },
        //         });
        //         const department = await Department.findOne({
        //             where: { _id: unit.dataValues.departmentId },
        //         });
        //         const center = await Center_VNPTHG.findOne({
        //             where: { _id: department.dataValues.centerVNPTHGId },
        //         });
        //         console.log("position:", unit);
        //         console.log("dep:", department);
        //         console.log("center:", center);
        //         console.log("nhân viên:", employee.dataValues);
        //         employee.dataValues.name = getDecrypt(employee.dataValues.name);
        //         employee.dataValues.phone = getDecrypt(employee.dataValues.phone);
        //         employee.dataValues.email = getDecrypt(employee.dataValues.email);
        //         position.dataValues.name = getDecrypt(position.dataValues.name);
        //         unit.dataValues.name = getDecrypt(unit.dataValues.name);
        //         department.dataValues.name = getDecrypt(department.dataValues.name);
        //         center.dataValues.name = getDecrypt(center.dataValues.name);
        //         task_employee.dataValues.Employees[i] = employee.dataValues;
        //         task_employee.dataValues.Employees[i].Position = position.dataValues;
        //         task_employee.dataValues.Employees[i].Unit = unit.dataValues;
        //         task_employee.dataValues.Employees[i].Unit.Department = department.dataValues;
        //         task_employee.dataValues.Employees[i].Unit.Department.Center = center.dataValues;
        //     }
        //     documents[i].dataValues = task_employee.dataValues;
        // }  

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
        console.log("id",req.params.id);
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
                include: [{
                    model: Customer_Types,
                },
                {
                    model: Customer_Work,
                    include: [{
                        model: Company_KH,
                    }]
                }
                ]
            },
            {
                model: Cycle,
            },
            {
                model: Appointment,
                include: [
                    {
                        model: Status_App
                    }
                ]
            },
            {
                model: Evaluate,
            },
            {
                model: Comment,
            }
            ]
        });
        const employee1 = await Employee_Task.findAll({
            where: {
              TaskId: req.params.id,
              //   through: { attributes: [] }, // Đảm bảo không lấy các trường trong bảng trung gian
            },
          });
          documents.dataValues["Employees"] = [];
          var i;
          for (i = 0; i < employee1.length; i++) {
            console.log("EID:", employee1[i].dataValues.EmployeeId);
            const employee = await Employee.findOne({
              where: { _id: employee1[i].dataValues.EmployeeId },
            });
            // console.log("id position",employee.dataValues)
            const position = await Position.findOne({
                where: { _id: employee.dataValues.postionId },
              });
            //   console.log("id position",employee.dataValues)
            const unit = await Unit.findOne({
                where: { _id: employee.dataValues.unitId },
            });
            const department = await Department.findOne({
                where: { _id: unit.dataValues.departmentId },
            });
            const center = await Center_VNPTHG.findOne({
                where: { _id: department.dataValues.centerVNPTHGId },
            });
            console.log("position:", unit);
            console.log("dep:", department);
            console.log("center:", center);
            console.log("nhân viên:", employee.dataValues);
            employee.dataValues.name = getDecrypt(employee.dataValues.name);
            employee.dataValues.phone = getDecrypt(employee.dataValues.phone);
            employee.dataValues.email = getDecrypt(employee.dataValues.email);
            position.dataValues.name = getDecrypt(position.dataValues.name);
            unit.dataValues.name = getDecrypt(unit.dataValues.name);
            department.dataValues.name = getDecrypt(department.dataValues.name);
            center.dataValues.name = getDecrypt(center.dataValues.name);
            documents.dataValues.Employees[i] = employee.dataValues;
            documents.dataValues.Employees[i].Position = position.dataValues;
            documents.dataValues.Employees[i].Unit = unit.dataValues;
            documents.dataValues.Employees[i].Unit.Department = department.dataValues;
            documents.dataValues.Employees[i].Unit.Department.Center = center.dataValues;
            //   documents.dataValues["Tasks"] = employee1.dataValues.Tasks;
          }
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

exports.update = async (req, res, next) => {
    console.log('update', req.body);
    // console.log(req.body.Status_Task.status);
    // console.log(req.body.Status_Task.reason);
    const { start_date, end_date, content, cycleId, customerId, leaderId, note, StatusTaskId, EvaluateId } = req.body;
    try {
        let tasks = [await Task.findOne({
            where: {
                _id: req.params.id,
            },
            include: [{
                model: Status_Task,
            },
            {
                model: Cycle,
            },
            ]
        })];

        tasks = tasks.filter(
            (value, index) => {
                return value.start_date == start_date && value.end_date == end_date && value.content == content
                    && value.cycleId == cycleId && value.customerId == customerId && value.leaderId == leaderId
                    && value.note== note && value.StatusTaskId == StatusTaskId && value.EvaluateId == EvaluateId;
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
                note: req.body.note,
                StatusTaskId: req.body.StatusTaskId,
                EvaluateId : req.body.EvaluateId,
            }, { where: { _id: req.params.id }, returning: true, });

            console.log(document);
            console.log("id",req.params.id);
            const comment = await Comment.update({
                content: req.body.Comment.content,
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




