const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/index');
const crypto = require('crypto');

const setPrimary = {
    type: DataTypes.STRING,
    defaultValue: () => uuidv4(),
    primaryKey: true,
}

const encryptionKey = '12345678912345678901234567890121';
const iv = '0123456789abcdef';

const setEncrypt = (value, name, modelInstance) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    modelInstance.setDataValue(name, encrypted);
}

const getDecrypt = (name, modelInstance) => {
    const value = modelInstance.getDataValue(name);
    if (value) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
        let decrypted = decipher.update(value, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    return null;
}

// Models
const Customer_Types = sequelize.define('Customer_Types', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Customer = sequelize.define('Customer', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('birthday', this);
        },
        set(value) {
            setEncrypt(value, 'birthday', this);
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('avatar', this);
        },
        set(value) {
            setEncrypt(value, 'avatar', this);
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('address', this);
        },
        set(value) {
            setEncrypt(value, 'address', this);
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('phone', this);
        },
        set(value) {
            setEncrypt(value, 'phone', this);
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('email', this);
        },
        set(value) {
            setEncrypt(value, 'email', this);
        },
    }
})

const Customer_Work = sequelize.define('Customer_Work', {
    _id: setPrimary,
    current_workplace: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('current_workplace', this);
        },
        set(value) {
            setEncrypt(value, 'current_workplace', this);
        },
    },
    work_history: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('work_history', this);
        },
        set(value) {
            setEncrypt(value, 'work_history', this);
        },
    },
    current_position: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('current_position', this);
        },
        set(value) {
            setEncrypt(value, 'current_position', this);
        },
    },
    work_temp: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('work_temp', this);
        },
        set(value) {
            setEncrypt(value, 'work_temp', this);
        },
    }
});

const Company_KH = sequelize.define('Company_KH', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Event = sequelize.define('Event', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Habit = sequelize.define('Habit', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Position = sequelize.define('Position', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Center_VNPTHG = sequelize.define('Center_VNPTHG', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Department = sequelize.define('Department', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Unit = sequelize.define('Unit', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Permission = sequelize.define('Permission', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Role = sequelize.define('Role', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Cycle = sequelize.define('Cycle', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    }
});

const Employee = sequelize.define('Employee', {
    _id: setPrimary,
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('name', this);
        },
        set(value) {
            setEncrypt(value, 'name', this);
        },
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('birthday', this);
        },
        set(value) {
            setEncrypt(value, 'birthday', this);
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('avatar', this);
        },
        set(value) {
            setEncrypt(value, 'avatar', this);
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('address', this);
        },
        set(value) {
            setEncrypt(value, 'address', this);
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('phone', this);
        },
        set(value) {
            setEncrypt(value, 'phone', this);
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('email', this);
        },
        set(value) {
            setEncrypt(value, 'email', this);
        },
    }
})

const Account = sequelize.define('Account', {
    _id: setPrimary,
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('user_name', this);
        },
        set(value) {
            setEncrypt(value, 'user_name', this);
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    }
});

const Appointment = sequelize.define('Appointment', {
    _id: setPrimary,
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('user_name', this);
        },
        set(value) {
            setEncrypt(value, 'user_name', this);
        },
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
});

const Status = sequelize.define('Status', {
    _id: setPrimary,
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    }
})

const Task = sequelize.define('Task', {
    _id: setPrimary,
    start_date: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
    end_date: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    }
})

const Log = sequelize.define('Log', {
    _id: setPrimary,
    created_at: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
    created_user: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return getDecrypt('password', this);
        },
        set(value) {
            setEncrypt(value, 'password', this);
        },
    }
})


// relationships

//one-to-many relationships
Customer_Types.hasMany(Customer, { foreignKey: 'customerTypesId' });
Customer.belongsTo(Customer_Types, { foreignKey: 'customerTypesId' });

Customer.hasMany(Customer_Work, { foreignKey: 'customerId' });
Customer_Work.belongsTo(Customer, { foreignKey: 'customerId' });

Company_KH.hasMany(Customer_Work, { foreignKey: 'companyId' });
Customer_Work.belongsTo(Company_KH, { foreignKey: 'companyId' });

Cycle.hasMany(Task, { foreignKey: 'cycleId' });
Task.belongsTo(Cycle, { foreignKey: 'cycleId' });

Status.hasMany(Task, { foreignKey: 'statusId' });
Task.belongsTo(Status, { foreignKey: 'statusId' });

Employee.hasMany(Task, { foreignKey: 'employeeId' });
Task.belongsTo(Employee, { foreignKey: 'employeeId' });

Task.hasMany(Appointment, { foreignKey: 'taskId' });
Appointment.belongsTo(Task, { foreignKey: 'taskId' });

Position.hasMany(Employee, { foreignKey: 'postionId' });
Employee.belongsTo(Position, { foreignKey: 'postionId' });

Unit.hasMany(Employee, { foreignKey: 'unitId' });
Employee.belongsTo(Unit, { foreignKey: 'unitId' });

Department.hasMany(Unit, { foreignKey: 'departmentId' });
Unit.belongsTo(Department, { foreignKey: 'departmentId' });

Center_VNPTHG.hasMany(Department, { foreignKey: 'centerVNPTHGId' });
Department.belongsTo(Center_VNPTHG, { foreignKey: 'centerVNPTHGId' });

Role.hasMany(Account, { foreignKey: 'roleId' });
Account.belongsTo(Role, { foreignKey: 'roleId' });

// many-to-many relationship
const Customer_Event = sequelize.define('Customer_Event', {});
Customer.belongsToMany(Event, { through: Customer_Event });
Event.belongsToMany(Customer, { through: Customer_Event });

const Customer_Habit = sequelize.define('Customer_Habit', {});
Customer.belongsToMany(Habit, { through: Customer_Habit });
Habit.belongsToMany(Customer, { through: Customer_Habit });

const Employee_Task = sequelize.define('Employee_Task', {});
Employee.belongsToMany(Task, { through: Employee_Task });
Task.belongsToMany(Employee, { through: Employee_Task });

const Role_Permission = sequelize.define('Role_Permission', {});
Role.belongsToMany(Permission, { through: Role_Permission });
Permission.belongsToMany(Role, { through: Role_Permission });

// one-to-one relationship
Employee.hasOne(Account);
Account.belongsTo(Employee);

// Sync the model with the database
Customer_Types.sync();
Customer.sync();
Customer_Work.sync();
Company_KH.sync();
Event.sync();
Habit.sync();
Position.sync();
Center_VNPTHG.sync();
Department.sync();
Unit.sync();
Permission.sync();
Role.sync();
Cycle.sync();
Employee.sync();
Account.sync();
Appointment.sync();
Status.sync();
Task.sync();
Log.sync();
Customer_Event.sync();
Customer_Habit.sync();
Employee_Task.sync();
Role_Permission.sync();

module.exports = {
    Customer_Types,
    Customer,
    Customer_Work,
    Company_KH,
    Event,
    Habit,
    Position,
    Center_VNPTHG,
    Department,
    Unit,
    Permission,
    Role,
    Cycle,
    Employee,
    Account,
    Appointment,
    Status,
    Task,
    Log,
    Customer_Event,
    Customer_Habit,
    Employee_Task,
    Role_Permission
};
