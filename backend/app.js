//socket
const notification = require('./app/controllers/notification.controller')
const { Notification, Event, Customer_Event } = require('./app/models/index.model')

// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

//mail
const nodemailer = require("nodemailer");
//socket
const moment = require('moment');

// initialize
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//socket
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('assignmentTask', () => {
    io.emit('notiTask')
  })

  socket.on('birthday', async (customers, _id, nameEm) => {
    const today = moment(); // Lấy ngày hiện tại
    const events = await Event.findAll();
    for (const customer of customers) {
      console.log("Khach hang nao v", customer.name)
      const birthday = moment(customer.birthday, 'YYYY-MM-DD');
      const customerBirthday = { year: birthday.year(), month: birthday.month(), date: birthday.date() };
      const todayDate = { year: today.year(), month: today.month(), date: today.date() };
      const age = todayDate.year - customerBirthday.year;
      if (todayDate.month === customerBirthday.month && todayDate.date === (customerBirthday.date - 1)) {
        const documents = await Notification.findAll({
          where: {
            idRecipient: _id,
          },
        })
        let count = 0
        if (documents.length > 0) {
          for (const value of documents) {
            if (value.title == "Sinh nhật" && value.content == `Ngày mai ${customerBirthday.date}/${customerBirthday.month + 1} là sinh nhật thứ ${age} của khách hàng "${customer.name}"`) {
              count++
            }
          }
          if (count > 0) {
            io.emit('notiTask')
          } else {
            await Notification.create({ title: "Sinh nhật", content: `Ngày mai ${customerBirthday.date}/${customerBirthday.month + 1} là sinh nhật thứ ${age} của khách hàng "${customer.name}"`, recipient: nameEm, sender: "", isRead: false, idRecipient: _id })
            io.emit('notiTask')
            /////event
            const events = await Event.findAll();
            if (events.length > 0) {
              let temp = 0
              for (let value of events) {
                console.log("Ten su kien", value.name)
                if (value.name == "Sinh nhật") {
                  temp++
                  ////// có sự kiện r thì thêm khách hàng dô
                  ////Cus_event
                  const cusEvent = await Customer_Event.findAll();
                  console.log("Khach hang trong su kien 1", cusEvent)
                  console.log("cus_event", cusEvent.length)
                  if (cusEvent.length > 0) {
                    let count = 0
                    for (let val of cusEvent) {
                      console.log("hallo", val.CustomerId, " = ", customer._id)
                      console.log("hallo", val.EventId, " = ", value._id)
                      if (val.CustomerId == customer._id && val.EventId == value._id) {
                        count++
                        break;
                      }
                    }
                    if (count == 0) {
                      console.log("Da them khach hang vao su kien 1", customer.name)
                      const doc = await Customer_Event.create({
                        CustomerId: customer._id,
                        EventId: value._id,
                      });
                    }
                  } else {
                    const doc = await Customer_Event.create({
                      CustomerId: customer._id,
                      EventId: value._id,
                    });
                  }
                }
              }
              if (temp == 0) {
                console.log("Da tao su kien")
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                const currentDay = ('0' + currentDate.getDate()).slice(-2);
                const currentHour = ('0' + currentDate.getHours()).slice(-2);
                const currentMinute = ('0' + currentDate.getMinutes()).slice(-2);

                const datetimeLocalFormat = `${currentYear}-${currentMonth}-${currentDay}T${currentHour}:${currentMinute}`;
                // const currentDate = new Date();
                // const formattedDateTime = currentDate.toISOString();
                // console.log('formattedDateTime', formattedDateTime);
                const docevent = await Event.create({
                  name: "Sinh nhật",
                  content: "Sinh nhật",
                  time_duration: datetimeLocalFormat,
                });
                ////Cus_event
                const cusEvent = await Customer_Event.findAll();
                console.log("Khach hang trong su kien 2", cusEvent)
                console.log("cus_event", cusEvent.length)
                if (cusEvent.length > 0) {
                  let count = 0
                  for (let val of cusEvent) {
                    console.log("hallo", val.CustomerId, " = ", customer._id)
                    console.log("hallo", val.EventId, " = ", docevent._id)
                    if (val.CustomerId == customer._id && val.EventId == docevent._id) {
                      count++
                      break;
                    }
                  }
                  if (count == 0) {
                    console.log("Da them khach hang vao su kien 2", customer.name)
                    const doc = await Customer_Event.create({
                      CustomerId: customer._id,
                      EventId: docevent._id,
                    });
                  }
                } else {
                  const doc = await Customer_Event.create({
                    CustomerId: customer._id,
                    EventId: docevent._id,
                  });
                }
              }
            } else {
              console.log("Chay vao event")
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
              const currentDay = ('0' + currentDate.getDate()).slice(-2);
              const currentHour = ('0' + currentDate.getHours()).slice(-2);
              const currentMinute = ('0' + currentDate.getMinutes()).slice(-2);

              const datetimeLocalFormat = `${currentYear}-${currentMonth}-${currentDay}T${currentHour}:${currentMinute}`;
              // const currentDate = new Date();
              const formattedDateTime = currentDate.toISOString();
              const document = await Event.create({
                name: "Sinh nhật",
                content: "Sinh nhật",
                time_duration: datetimeLocalFormat,
              });
              console.log("Da tao su kien")
              ////Cus_event
              const cusEvent = await Customer_Event.findAll();
              console.log("Khach hang trong su kien 3", cusEvent)
              if (cusEvent.length > 0) {
                let count = 0
                for (let val of cusEvent) {
                  if (val.CustomerId == customer._id && val.EventId == document._id) {
                    count++
                    break;
                  }
                }
                if (count == 0) {
                  console.log("Da them khach hang vao su kien 3", customer.name)
                  const doc = await Customer_Event.create({
                    CustomerId: customer._id,
                    EventId: document._id,
                  });
                }
              } else {
                const doc = await Customer_Event.create({
                  CustomerId: customer._id,
                  EventId: document._id,
                });
              }
            }
            // ////mail
            // const transporter = nodemailer.createTransport({
            //   service: "gmail",
            //   auth: {
            //     user: "maxvolum2012@gmail.com",
            //     pass: "wisbbpolajrseqqd",
            //   },
            // });

            // const mailOptions = {
            //   from: 'maxvolum2012@gmail.com',
            //   to: customer.email,
            //   subject: 'Chúc mừng sinh nhật',
            //   html: `Dear ${customer.name}!
            //         <br> Chúc mừng sinh nhật lần thứ ${age} của bạn`,
            // };

            // const info = await transporter.sendMail(mailOptions);
            // console.log("Email sent:", info.messageId);
            // console.log("Thành công 1");    
          }
        }
        else {
          await Notification.create({ title: "Sinh nhật", content: `Ngày mai ${customerBirthday.date}/${customerBirthday.month + 1} là sinh nhật thứ ${age} của khách hàng "${customer.name}"`, recipient: nameEm, sender: "", isRead: false, idRecipient: _id })
          /////event
          const events = await Event.findAll();
          if (events.length > 0) {
            let temp = 0
            for (let value of events) {
              console.log("Ten su kien", value.name)
              if (value.name == "Sinh nhật") {
                temp++
                ////// có sự kiện r thì thêm khách hàng dô
                ////Cus_event
                const cusEvent = await Customer_Event.findAll();
                console.log("Khach hang trong su kien 1", cusEvent)
                console.log("cus_event", cusEvent.length)
                if (cusEvent.length > 0) {
                  let count = 0
                  for (let val of cusEvent) {
                    console.log("hallo", val.CustomerId, " = ", customer._id)
                    console.log("hallo", val.EventId, " = ", value._id)
                    if (val.CustomerId == customer._id && val.EventId == value._id) {
                      count++
                      break;
                    }
                  }
                  if (count == 0) {
                    console.log("Da them khach hang vao su kien 1", customer.name)
                    const doc = await Customer_Event.create({
                      CustomerId: customer._id,
                      EventId: value._id,
                    });
                  }
                } else {
                  const doc = await Customer_Event.create({
                    CustomerId: customer._id,
                    EventId: value._id,
                  });
                }
              }
            }
          } else {
            console.log("Chay vao event")
            // const currentDate = new Date();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            const currentDay = ('0' + currentDate.getDate()).slice(-2);
            const currentHour = ('0' + currentDate.getHours()).slice(-2);
            const currentMinute = ('0' + currentDate.getMinutes()).slice(-2);

            const datetimeLocalFormat = `${currentYear}-${currentMonth}-${currentDay}T${currentHour}:${currentMinute}`;
            const formattedDateTime = currentDate.toISOString();
            const document = await Event.create({
              name: "Sinh nhật",
              content: "Sinh nhật",
              time_duration: datetimeLocalFormat,
            });
            console.log("Da tao su kien")
            ////Cus_event
            const cusEvent = await Customer_Event.findAll();
            console.log("Khach hang trong su kien 3", cusEvent)
            if (cusEvent.length > 0) {
              let count = 0
              for (let val of cusEvent) {
                if (val.CustomerId == customer._id && val.EventId == document._id) {
                  count++
                  break;
                }
              }
              if (count == 0) {
                console.log("Da them khach hang vao su kien 3", customer.name)
                const doc = await Customer_Event.create({
                  CustomerId: customer._id,
                  EventId: document._id,
                });
              }
            } else {
              const doc = await Customer_Event.create({
                CustomerId: customer._id,
                EventId: document._id,
              });
            }
          }
          //   const transporter = nodemailer.createTransport({
          //     service: "gmail",
          //     auth: {
          //       user: "maxvolum2012@gmail.com",
          //       pass: "wisbbpolajrseqqd",
          //     },
          //   });

          //   const mailOptions = {
          //     from: 'maxvolum2012@gmail.com',
          //     to: customer.email,
          //     subject: 'Chúc mừng sinh nhật',
          //     html: `Dear ${customer.name}!
          //           <br> Chúc mừng sinh nhật lần thứ ${age} của bạn`,
          //   };

          //   const info = await transporter.sendMail(mailOptions);
          //   console.log("Email sent:", info.messageId);
          //   console.log("Thành công 2");    
          io.emit('notiTask')
        }
      }
    };
  });

  socket.on('cycleCus', async (Tasks) => {
    for (const value of Tasks) {
      if (value.Status_Task.name == "đã chăm sóc") {
        console.log("Tasks ne", value);
        const today = moment();
        const todayDate = { year: today.year(), month: today.month(), date: today.date() };
        const start_day = moment(value.start_date, 'YYYY-MM-DD');
        let end_day = moment(value.end_date, 'YYYY-MM-DD');
        value.end_date = moment(value.end_date, 'YYYY-MM-DD');
        console.log("ngay bat dau", start_day)
        let coming_day = start_day
        if (start_day.isBefore(today)) {
          var parts = value.Cycle.name.split(' ');
          var number = parseInt(parts[0]);
          var string = parts[1];
          switch (string) {
            case 'ngày':
              coming_day = coming_day.add(number, 'days');
              end_day = end_day.add(number, 'days');
              break;
            case 'tuần':
              coming_day = coming_day.add(number * 7, 'days');
              end_day = end_day.add(number * 7, 'days');
              break;
            case 'tháng':
              coming_day = coming_day.add(number, 'months');
              end_day = end_day.add(number, 'months');
              break;
            case 'quý':
              coming_day = coming_day.add(number * 3, 'months');
              end_day = end_day.add(number * 3, 'months');
              break;
            case 'năm':
              coming_day = coming_day.add(number, 'years');
              end_day = end_day.add(number, 'years');
              break;
            default:
              console.log("Chu kì k hợp lệ")
              break;
          }
          for (const i of Tasks) {
            console.log("cus cu", value.Customer._id, "cú moi", i.Customer._id)
            console.log("dai nhieu", value.Employees.length)
            if (value.Customer._id == i.Customer._id && value.Employees.length != 0) {
              const start_dateItem = moment(i.start_date, 'YYYY-MM-DD');
              const end_dateItem = moment(i.end_date, 'YYYY-MM-DD');
              if (coming_day.isSame(value.end_date)) {
                if ((start_dateItem).isSame(coming_day.add(1, 'days')) && (end_dateItem).isSame(end_day.add(1, 'days'))) {
                  coming_day = start_dateItem
                  value.Employees = i.Employees
                  value.content = i.content
                  console.log("hahahahaha", value.Employees)
                }
              } else
                if ((start_dateItem).isSame(coming_day) && (end_dateItem).isSame(end_day)) {
                  coming_day = start_dateItem
                  value.Employees = i.Employees
                  value.content = i.content
                  console.log("hahahahaha", value.Employees)
                }
            }
          }
          today.startOf('day');
          coming_day.startOf('day');
          console.log("coming_day", coming_day, "cua khach hang", value.Customer.name)
          console.log("today", today)
          console.log("1 ngay bat dau moi", coming_day, "ngay ket thuc cu", value.end_date)
          if (coming_day.isSame(value.end_date)) {
            coming_day = coming_day.add(1, 'days');
            end_day = end_day.add(1, 'days');
            console.log("hihihihi")
          }
          if (coming_day.subtract(1, 'days').isSame(today)) {
            if (!value.Employees.length) {
              console.log("Employee rong")
              const notice = await Notification.findAll({
                where: {
                  idRecipient: value.leaderId,
                }
              })
              let count = 0
              console.log("tat ca thong bao", value.leaderId)
              console.log("tat ca thong bao", notice)
              if (notice.length > 0) {
                for (const item of notice) {
                  console.log("Thongbaone", item._id)
                  if (item.title == "Phân công chưa được giao" && item.content == `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`) {
                    count++
                  }
                }
                console.log("count bang", count)
                if (count > 0) {
                  io.emit('notiTask')
                } else {
                  await Notification.create({ title: "Phân công chưa được giao", content: `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
                  console.log("Tao thanh cong")
                  io.emit('notiTask')
                  // console.log("Khách hàng nào: ",customer);    
                }
              } else {
                await Notification.create({ title: "Phân công chưa được giao", content: `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
                console.log("tao thanh cong 2")
                const notice = await Notification.findAll({
                  where: {
                    idRecipient: value.leaderId,
                  }
                })
                console.log("dem notify", notice)
                io.emit('notiTask')
              }
            } else {
              const documents = await Notification.findAll({
                where: {
                  idRecipient: value.leaderId,
                },
              })
              let count = 0
              if (documents.length >= 0) {
                for (const item of documents) {
                  console.log("Thongbaone", item._id)
                  if (item.title == "Tới chu kỳ" && item.content == `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`) {
                    count++
                  }
                }
                console.log("count bang", count)
                if (count > 0) {
                  io.emit('notiTask')
                } else {
                  await Notification.create({ title: "Tới chu kỳ", content: `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
                  console.log("value.Customers.name", value.leaderId)
                  io.emit('notiTask')
                  // console.log("Khách hàng nào: ",customer);    
                }
              } else {
                await Notification.create({ title: "Tới chu kỳ", content: `Ngày mai ${todayDate.date + 1}/${todayDate.month + 1} là chu kỳ chăm sóc "${value.Cycle.name}" của khách hàng "${value.Customer.name}" với nội dung chăm sóc: ${value.content}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
                console.log("value.Customers.name", value.leaderId)
                io.emit('notiTask')
              }
            }
          }
        }
      }
    }
  })

  socket.on('lateCus', async (Tasks) => {
    for (const value of Tasks) {
      if (value.Status_Task.name == "đã chăm sóc") {
        let start_day = moment(value.start_date, 'YYYY-MM-DD');
        let end_day = moment(value.end_date, 'YYYY-MM-DD');
        let end_dayold = moment(value.end_date, 'YYYY-MM-DD');
        let countC = 0
        let shouldBreak = false;
        while (end_day.isBefore(moment(), 'day') && !shouldBreak) {
          var parts = value.Cycle.name.split(' ');
          var number = parseInt(parts[0]);
          var string = parts[1];
          switch (string) {
            case 'ngày':
              start_day = start_day.add(number, 'days');
              end_day = end_day.add(number, 'days');
              break;
            case 'tuần':
              start_day = start_day.add(number * 7, 'days');
              end_day = end_day.add(number * 7, 'days');
              break;
            case 'tháng':
              start_day = start_day.add(number, 'months');
              end_day = end_day.add(number, 'months');
              break;
            case 'quý':
              start_day = start_day.add(number * 3, 'months');
              end_day = end_day.add(number * 3, 'months');
              break;
            case 'năm':
              start_day = start_day.add(number, 'years');
              end_day = end_day.add(number, 'years');
              break;
            default:
              console.log("Chu kỳ không hợp lệ");
              break;
          }
          if (start_day.isSame(end_dayold)) {
            end_dayold = end_day
            start_day = start_day.add(1, 'days');
            end_day = end_day.add(1, 'days');
          }
          countC++
          for (const i of Tasks) {
            if (start_day.isSame(i.start_date) && end_day.isSame(i.end_date)) {
              shouldBreak = true;
              break
            }
          }
        }
        if (countC > 2) {
          let count = 0
          const notice = await Notification.findAll({
            where: {
              idRecipient: value.leaderId,
            }
          })
          if (notice.length > 0) {
            for (const item of notice) {
              if (item.title == "Cần chú ý" && item.content == `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${value.end_date}`) {
                count++
              }
            }
            if (count > 0) {
              io.emit('notiTask')
            } else {
              await Notification.create({ title: "Cần chú ý", content: `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${value.end_date}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
              io.emit('notiTask')
              console.log("Tao thanh cong 1")
            }
          } else {
            await Notification.create({ title: "Cần chú ý", content: `Khách hàng "${value.Customer.name}" đã lâu chưa được chăm sóc kể từ ngày ${value.end_date}`, recipient: "Lãnh đạo", sender: "", isRead: false, idRecipient: value.leaderId })
            io.emit('notiTask')
            console.log("Tao thanh cong 2")
          }
        }
      }
    }
  })
});



server.listen(3000, () => {
  console.log(`Server is listening on port`);
});

// config path
const pathPublic = path.join(__dirname, "./app/public");
app.use("/public", express.static(pathPublic));

// simple route
app.get("/", (req, res, next) => {
  return res.send({
    message: "Welcom to Personal CRM System",
  });
});

// handles before https methods
const convertToLowercase = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].toLowerCase();
    }
  }
  next();
};

app.use(convertToLowercase);

// initialize router
const customerRouter = require("./app/routes/customer.route");
const customer_typesRouter = require("./app/routes/customer_types.route");
const customer_workRouter = require("./app/routes/customer_work.route");
const Company_KHRouter = require("./app/routes/company_KH.route");
const EventRouter = require("./app/routes/event.route");
const HabitRouter = require("./app/routes/habit.route");
const PositionRouter = require("./app/routes/position.route");
const Center_VNPTHGRouter = require("./app/routes/center_VNPTHG.route");
const DepartmentRouter = require("./app/routes/department.route");
const UnitRouter = require("./app/routes/unit.route");
const PermissionRouter = require("./app/routes/permission.route");
const RoleRouter = require("./app/routes/role.route");
const CycleRouter = require("./app/routes/cycle.route");
const EmployeeRouter = require("./app/routes/employee.route");
const AccountRouter = require("./app/routes/account.route");
const AppointmentRouter = require("./app/routes/appointment.route");
const TaskRouter = require("./app/routes/task.route");
const LogRouter = require("./app/routes/log.route");
const Role_PermissionRouter = require("./app/routes/role_permission.route");
const Customer_EventRouter = require("./app/routes/customer_event.route");
const Customer_HabitRouter = require("./app/routes/customer_habit.route");
const Task_EmployeeRouter = require("./app/routes/task_employee.route");
const MailRouter = require("./app/routes/mail.route");
const LoginRouter = require("./app/routes/login.route");
const Status_TaskRouter = require("./app/routes/status_task.route");
const EvaluateRouter = require("./app/routes/evaluate.route");
const Status_AppRouter = require("./app/routes/status_app.route");
const notificationRouter = require('./app/routes/notification.route');

// use router
app.use("/api/customers", customerRouter);
app.use("/api/customer_types", customer_typesRouter);
app.use("/api/customer_works", customer_workRouter);
app.use("/api/company_khs", Company_KHRouter);
app.use("/api/events", EventRouter);
app.use("/api/habits", HabitRouter);
app.use("/api/positions", PositionRouter);
app.use("/api/center_vnpthgs", Center_VNPTHGRouter);
app.use("/api/departments", DepartmentRouter);
app.use("/api/units", UnitRouter);
app.use("/api/permissions", PermissionRouter);
app.use("/api/roles", RoleRouter);
app.use("/api/cycles", CycleRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/accounts", AccountRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/tasks", TaskRouter);
app.use("/api/logs", LogRouter);
app.use("/api/role_permissions", Role_PermissionRouter);
app.use("/api/customer_events", Customer_EventRouter);
app.use("/api/customer_habits", Customer_HabitRouter);
app.use("/api/task_employees", Task_EmployeeRouter);
app.use("/api/mail", MailRouter);
app.use("/api/login", LoginRouter);
app.use("/api/status_tasks", Status_TaskRouter);
app.use("/api/evaluates", EvaluateRouter);
app.use("/api/status_apps", Status_AppRouter);
app.use('/api/notification', notificationRouter);
// // check errors
app.use((req, res, next) => {
  return next(createError(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// exports
module.exports = app;
