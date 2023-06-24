const { Appointment, Status_App, Task } = require("../models/index.model.js");
const { DataTypes, Op } = require("sequelize");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
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
// checked
exports.create = async (req, res, next) => {
  console.log("thong tinnnnnn", req.body);
  if (Object.keys(req.body).length >= 5) {
    const { date_time, content, note, place, taskId } = req.body;
    var StatusAppId;
    const appointments = await Appointment.findAll();
    for (let value of appointments) {
      if (value.date_time == date_time && value.taskId == taskId) {
        return res.send({
          error: true,
          msg: `Đã tồn tại cuộc hẹn ${value.content} lúc ${value.date_time}.`,
        });
      }
    }
    try {
      const status_apps = await Status_App.findAll();
      var a = 0;
      console.log("chieu dai", status_apps.length);
      if (status_apps.length > 0) {
        console.log("vaooooooooooo");
        console.log("status app", status_apps);
        console.log("name  dsf", status_apps.Status_App);
        for (let value of status_apps) {
          // console.log("status task hahaha ", value.dataValues.name);
          value.dataValues.name = getDecrypt(value.dataValues.name);
          console.log("name", value.dataValues.name);
          console.log(
            "name ahhahahaha",
            value.dataValues.name,
            value.dataValues.name == "chưa xác nhận"
          );
          if (value.dataValues.name == "chưa xác nhận") {
            console.log("kiem tra", value.dataValues.name);
            StatusAppId = value.dataValues._id;
            console.log("id status_task hahaahha", StatusAppId);
            a = 0;
            break;
          } else {
            a = 1;
          }
        }
        console.log("a kkkkkkk", a);
        if (a != 0) {
          const status_app = await Status_App.create({
            name: "chưa xác nhận",
          });
          StatusAppId = status_app._id;
          console.log("status_app", status_app);
        }
        console.log("id status_task hahaahha", StatusAppId);
        // console.log("status task", statusId);
      } else {
        const status_app = await Status_App.create({
          name: "chưa xác nhận",
        });
        StatusAppId = status_app._id;
        console.log("status_task", status_app);
      }
      const document = await Appointment.create({
        date_time: date_time,
        content: content,
        place: place,
        note: note,
        taskId: taskId,
        StatusAppId: StatusAppId,
      });

      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công cuộc hẹn ${document.content} lúc ${document.date_time}.`,
        document: document,
      });
    } catch (error) {
      // console.log(error.errors[0].message);
      return res.send({
        error: true,
        // msg: error.errors[0].message,
      });
    }
  } else {
    return res.send({
      error: true,
      msg: `Vui lòng nhập đủ thông tin.`,
    });
  }
};

// checked
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Appointment.findAll();
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error findAll !"));
  }
};

// checked
exports.findOne = async (req, res, next) => {
  try {
    const document = await Appointment.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(document);
  } catch (error) {
    return next(createError(400, "Error findOne"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        _id: req.params.id,
      },
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
    return next(createError(400, "Error deleteOne"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
  } catch (error) {}
};

// exports.update = async (req, res, next) => {
//     console.log("hahaha",req.body.taskId)
//     const { date_time, content, place, note, StatusAppId } = req.body;
//     try {
//         let appointments = [await Appointment.findOne({
//             where: {
//                 _id: req.params.id,
//             }
//         })];
//         if(appointments.date_time == date_time){
//             appointments = appointments.filter(
//                 (value, index) => {
//                     return value.date_time == date_time && value.content == content
//                     && value.place == place && value.note == note && value.StatusAppId == StatusAppId;
//                 }
//             )
//             if (appointments.length == 0) {
//                 const appointments = await Appointment.findAll({
//                     where:{
//                         taskId: req.body.taskId
//                     }
//                 });

//                 const document = await Appointment.update({
//                     date_time: date_time,
//                     content: content,
//                     place: place,
//                     note:  note,
//                     StatusAppId: StatusAppId,
//                 }, { where: { _id: req.params.id }, returning: true, })
//             } else {
//                 return res.send({
//                     error: true,
//                     msg: 'Dữ liệu chưa được thay đổi.'
//                 })
//             }
//             ;
//         }

//         var test=0;
//         console.log("app", appointments);
//         for (let value of appointments) {
//             value.dataValues.date_time = getDecrypt(value.dataValues.date_time);
//             value.dataValues.content = getDecrypt(value.dataValues.content);
//             console.log("gio ",value.dataValues.date_time == date_time )
//             if (value.dataValues.date_time == date_time) {
//                 test++;
//             }
//         }
//             console.log("test", test);
//             if(test !=0)
//             return res.send({
//                 error: true,
//                 msg: `Đã tồn tại cuộc hẹn ${content} lúc ${date_time}.`
//             })
//         return res.send({
//             error: false,
//             msg: 'Dữ liệu đã được thay đổi thành công.',
//         })

//     } catch (error) {
//         console.log(error);
//         return next(
//             createError(400, 'Error update')
//         )
//     }
// }

exports.update = async (req, res, next) => {
  console.log("hahaha1111", req.body.taskId);
  const { date_time, content, place, note, StatusAppId } = req.body;

  try {
    let appointments = [
      await Appointment.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];
    console.log("mot minh", appointments[0].dataValues.date_time);
    var date_time1 = getDecrypt(appointments[0].dataValues.date_time);
    console.log("kjkjkj", appointments[0].dataValues.date_time == date_time);
    console.log("kjkjkjkj", appointments[0].dataValues.date_time, date_time);
    if (date_time1 == date_time) {
      console.log("vaooooooo");
      appointments = appointments.filter((value, index) => {
        return (
          value.date_time == date_time &&
          value.place == place &&
          value.note == note &&
          value.StatusAppId == StatusAppId &&
          value.content == content
        );
      });
      console.log("chieu dai", appointments.length);
      if (appointments.length == 0) {
        const document = await Appointment.update(
          {
            date_time: date_time,
            content: content,
            place: place,
            note: note,
            StatusAppId: StatusAppId,
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
    } else {
      console.log("Vao else");
      const appointments1 = await Appointment.findAll({
        where: {
          taskId: req.body.taskId,
        },
      });
      console.log("appointment1", appointments1);
      var test = 0;
      for (let value of appointments1) {
        value.dataValues.date_time = getDecrypt(value.dataValues.date_time);
        value.dataValues.content = getDecrypt(value.dataValues.content);
        console.log("coi 2 gio ne", value.dataValues.date_time, date_time);

        console.log("gio ", value.dataValues.date_time == date_time);
        if (value.dataValues.date_time == date_time) {
          test++;
        }
        console.log("test:", test);
      }
      if (test != 0) {
        return res.send({
          error: true,
          msg: `Đã tồn tại cuộc hẹn ${content} lúc ${date_time}.`,
        });
      }
      try {
        const document = await Appointment.update(
          {
            date_time: date_time,
            content: content,
            place: place,
            note: note,
            StatusAppId: StatusAppId,
          },
          { where: { _id: req.params.id }, returning: true }
        );
        return res.send({
          error: false,
          msg: "Dữ liệu đã được thay đổi thành công.",
        });
      } catch (error) {
        console.log(error);
        return next(createError(400, "Error update"));
      }
    }
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error update"));
  }
};

exports.finAllAppointment = async (req, res, next) => {
  try {
    const document = await Appointment.findAll({
      where: {
        taskId: req.params.id,
      },
    });
    for (let i = 0; i < document.length; i++) {
      var status = await Status_App.findOne({
        where: { _id: document[i].dataValues.StatusAppId },
      });
      status.dataValues.name = getDecrypt(status.dataValues.name);
      console.log("Status:", status.dataValues.name);
      document[i].dataValues.Status_App = status.dataValues;
    }
    console.log(document);
    return res.send(document);
  } catch (error) {
    return next(createError(400, "Error findOne"));
  }
};
