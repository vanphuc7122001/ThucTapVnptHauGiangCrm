import {
  reactive,
  Customer,
  http_getAll,
  Employee,
  Customer_Work,
  Task,
  http_getOne,
} from "../../common/import";

import { isEqual, isBefore, isAfter, isSameDay } from "date-fns";

const data = reactive({
  items: [],
});

export const countCustomer = async () => {
  const res = await http_getAll(Customer);
  return res.documents.length;
};

export const countEmployee = async () => {
  const res = await http_getAll(Employee);
  return res.length;
};

// khách hàng đã lâu chưa chăm sóc

export const countElementReportPage = async () => {
  const cusWork = await http_getAll(Customer_Work);
  data.items = cusWork.documents.filter((cusWork) => {
    const taskCusCared = cusWork.Customer.Tasks.filter((task) => {
      if (task.Status_Task.name == "đã chăm sóc") {
        // lấy các khách hàng đã chăm sóc
        const cycle = task.Cycle.name; // lấy chu kì
        let start_date = task.start_date; // lấy ngày bắt đầu
        let end_date = task.end_date;
        start_date = new Date(start_date); // chuyển chuổi sang date

        end_date = new Date(end_date);

        end_date =
          end_date.getFullYear() +
          "-" +
          (end_date.getMonth() + 1) +
          "-" +
          end_date.getDate();

        let numberOfCycle = cycle.replace(/\D/g, ""); // lấy số trong chu kì

        numberOfCycle = +numberOfCycle; // ép kiểu sang số nguyên

        var cycleDate = 0;
        var cycleMonth = 0;
        var cycleYear = 0;
        switch (true) {
          case cycle.includes("ngày"):
            cycleDate = numberOfCycle; // Nửa sửa bỏ nhân 2
            break;
          case cycle.includes("tháng"):
            cycleMonth = numberOfCycle; // Nửa sửa bỏ nhân 2
            break;
          case cycle.includes("năm"):
            cycleYear = numberOfCycle; // Nửa sửa bỏ nhân 2
            break;
          case cycle.includes("tuần"):
            cycleDate = numberOfCycle * 7;
            break;
        }

        // lần bắt đầu đầu tiên
        start_date.setDate(start_date.getDate() + cycleDate);
        start_date.setMonth(start_date.getMonth() + cycleMonth);
        start_date.setFullYear(start_date.getFullYear() + cycleYear);
        const year = start_date.getFullYear();
        const month = start_date.getMonth() + 1;
        const day = start_date.getDate();
        let dayStartNewCycle = year + "-" + month + "-" + day; // ngày bắt đầu chu kì mới
        // console.log('So sanh dayStartNewCycle', dayStartNewCycle , 'End date',end_date);

        // cycleDate = ((cycleDate) * 2);

        if (isAfter(new Date(dayStartNewCycle), new Date(end_date))) {
          cycleDate = cycleDate * 2;
        }

        if (dayStartNewCycle == end_date) {
          // nếu ngày bắt đầu chu kì mới == end_date thì + 1
          dayStartNewCycle = year + "-" + month + "-" + (day + 1);
          cycleDate = cycleDate * 2;
        }

        if (isBefore(new Date(dayStartNewCycle), new Date(end_date))) {
          let end_day = new Date(end_date);
          dayStartNewCycle =
            end_day.getFullYear() +
            "-" +
            (end_day.getMonth() + 1) +
            "-" +
            (end_day.getDate() + 1);
          cycleDate = cycleDate * 2 + 1;
        }

        // console.log('So sanh dayStartNewCycle ++ ', dayStartNewCycle , 'End date ++ ',end_date);

        // lần bắt đầu thứ 2
        cycleMonth = cycleMonth * 2;
        cycleYear = cycleYear * 2;
        start_date.setDate(start_date.getDate() + cycleDate);
        start_date.setMonth(start_date.getMonth() + cycleMonth);
        start_date.setFullYear(start_date.getFullYear() + cycleYear);
        const year2 = start_date.getFullYear();
        const month2 = start_date.getMonth() + 1;
        const day2 = start_date.getDate();
        const dayStartNewCycle2 = year2 + "-" + month2 + "-" + day2;

        task.dayStartNewCycle2 = dayStartNewCycle2;
        task.dayStartNewCycle = dayStartNewCycle;
        return task;
      }
    });

    // import { isEqual, isBefore, isAfter } from 'date-fns';

    const rsTaskCusCared = taskCusCared.filter((value, index) => {
      let dayStartNewCycle2 = new Date(value.dayStartNewCycle2);
      let dayStartNewCycle = new Date(value.dayStartNewCycle);
      console.log("Index", index);
      console.log("Day 1", dayStartNewCycle);
      console.log("Day 2", dayStartNewCycle2);

      let currentDay = new Date();
      if (value.customerId == cusWork.Customer._id) {
        return cusWork.Customer.Tasks.filter((task) => {
          let start_date = new Date(task.start_date);

          if (
            (isAfter(dayStartNewCycle2, currentDay) ||
              isEqual(dayStartNewCycle2, currentDay)) &&
            !isSameDay(dayStartNewCycle2, start_date) &&
            !isSameDay(dayStartNewCycle, start_date)
          ) {
            return task;
          } else {
            console.log("Run task");
          }
        });
      }
    });

    if (rsTaskCusCared.length > 0) {
      return rsTaskCusCared;
    }
  });

  //   console.log("data items in use index", data.items.length);
  return data.items.length;
};

// khách hàng tới chu kì nhưng chưa chăm sóc

export const countElementReportCustomerCyclePage = async () => {
  const cusWork = await http_getAll(Customer_Work);
  data.items = cusWork.documents.filter((cusWork) => {
    const taskCusCared = cusWork.Customer.Tasks.filter((task) => {
      if (task.Status_Task.name == "đã chăm sóc") {
        const cycle = task.Cycle.name;
        let start_date = task.start_date;
        // console.log(start_date);
        start_date = new Date(start_date);
        // console.log('end_date: ' + end_date);

        let numberOfCycle = cycle.replace(/\D/g, ""); // lấy số trong chuổi

        numberOfCycle = +numberOfCycle; // chuyển chuổi thành số nguyên

        var cycleDate = 0;
        var cycleMonth = 0;
        var cycleYear = 0;
        switch (true) {
          case cycle.includes("ngày"):
            cycleDate = numberOfCycle;
            break;
          case cycle.includes("tháng"):
            cycleMonth = numberOfCycle;
            break;
          case cycle.includes("năm"):
            cycleYear = numberOfCycle;
            break;
          case cycle.includes("tuần"):
            cycleDate = numberOfCycle * 7;
            break;
        }

        start_date.setDate(start_date.getDate() + cycleDate);
        start_date.setMonth(start_date.getMonth() + cycleMonth);
        start_date.setFullYear(start_date.getFullYear() + cycleYear);

        const year = start_date.getFullYear();
        const month = start_date.getMonth() + 1;
        const day = start_date.getDate();
        const dayStartNewCycle = year + "-" + month + "-" + day; // ngày bắt đầu chu kì mới
        task.dayStartNewCycle = dayStartNewCycle;
        return task;
      }
    });

    const rsTaskCusCared = taskCusCared.filter((value) => {
      if (value.customerId == cusWork.Customer._id) {
        return cusWork.Customer.Tasks.filter((task) => {
          if (value.dayStartNewCycle == task.start_date) {
            console.log("Run");
          } else {
            // console.log('Value');
            return value;
          }
        });
      }
    });

    if (rsTaskCusCared.length > 0) {
      return rsTaskCusCared;
    }
  });

  return data.items.length;
};

// khách hàng do nhân viên chăm sóc

export const countElementReportAssignmentStaff = async () => {
  const tasks = await http_getAll(Task);
  return tasks.filter((task, index) => {
    return (
      tasks.findIndex((value) => value.Customer._id === task.Customer._id) ===
      index
    );
  }).length;
};

// khách hàng do lảnh đạo phụ trách
export const countElementReportLeaderCustomer = async () => {
  const leaderId = sessionStorage.getItem("employeeId");

  const tasks = await http_getAll(Task);
  return tasks.filter((task) => {
    return task.leaderId == leaderId; // người giao việc và nhân viên là mình
  }).length;
};

// nhân viên do lảnh đạo phụ trách
export const countElementReportLeaderStaff = async () => {
  const leaderId = sessionStorage.getItem("employeeId");
  const tasks = await http_getAll(Task);

  const ListTaskId = [];
  tasks.map((task) => {
    ListTaskId.push(task._id);
  });

  for (const _id of ListTaskId) {
    const rs = await http_getOne(Task, _id);
    data.items.push(rs);
  }

  data.items = data.items.map((task) => {
    if (task.leaderId == leaderId) {
      return [...task.Employees];
    }
  });

  data.items = data.items.filter((task) => {
    return task != undefined;
  });

  // console.log("items use", data.items);
  const newArray = [];

  // chuyển mảng 2 chiều thành mảng 1 chiều
  for (let i = 0; i < data.items.length; i++) {
    for (let j = 0; j < data.items[i].length; j++) {
      newArray.push(data.items[i][j]);
    }
  }

  data.items = newArray.map((item) => {
    return {
      ...item,
    };
  });

  return data.items.length;
};
