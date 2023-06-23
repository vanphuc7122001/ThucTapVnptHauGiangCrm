// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// initialize
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

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
