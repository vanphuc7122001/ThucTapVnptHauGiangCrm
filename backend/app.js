// npm packages
const createError = require('http-errors');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// initialize
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// simple route
app.get('/', (req, res, next) => {
    return res.send({
        message: 'Welcom to Personal CRM System'
    })
});

// handles before https methods
const convertToLowercase = (req, res, next) => {
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].toLowerCase();
        }
    }
    next();
};

app.use(convertToLowercase);

// initialize router
const customerRouter = require('./app/routes/customer.route');
const customer_typesRouter = require('./app/routes/customer_types.route');
const customer_workRouter = require('./app/routes/customer_work.route');
const Company_KHRouter = require('./app/routes/company_KH.route');
const EventRouter = require('./app/routes/event.route');
const HabitRouter = require('./app/routes/habit.route');
const PositionRouter = require('./app/routes/position.route');
const Center_VNPTHGRouter = require('./app/routes/center_VNPTHG.route');
const DepartmentRouter = require('./app/routes/department.route');
const UnitRouter = require('./app/routes/unit.route');
const PermissionRouter = require('./app/routes/permission.route');
const RoleRouter = require('./app/routes/role.route');
const CycleRouter = require('./app/routes/cycle.route');
const EmployeeRouter = require('./app/routes/employee.route');
const AccountRouter = require('./app/routes/account.route');
const AppointmentRouter = require('./app/routes/appointment.route');
const TaskRouter = require('./app/routes/task.route');
const LogRouter = require('./app/routes/log.route');

// use router
app.use('/api/customers', customerRouter);
app.use('/api/customer_types', customer_typesRouter);
app.use('/api/customer_works', customer_workRouter);
app.use('/api/company_KHs', Company_KHRouter);
app.use('/api/events', EventRouter);
app.use('/api/habits', HabitRouter);
app.use('/api/positions', PositionRouter);
app.use('/api/center_VNPTHGs', Center_VNPTHGRouter);
app.use('/api/departments', DepartmentRouter);
app.use('/api/units', UnitRouter);
app.use('/api/permissions', PermissionRouter);
app.use('/api/roles', RoleRouter);
app.use('/api/cycles', CycleRouter);
app.use('/api/employees', EmployeeRouter);
app.use('/api/accounts', AccountRouter);
app.use('/api/appointments', AppointmentRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/logs', LogRouter);

// check errors
app.use((req, res, next) => {
    return next(
        createError(404, 'Resource Not Found')
    );
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});


// exports
module.exports = app;

