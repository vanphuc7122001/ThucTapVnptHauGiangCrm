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
  const tasks = await http_getAll(Task);
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
          case cycle.includes("quý"):
            cycleDate = 90;
          case cycle.includes("quí"):
            cycleDate = 90;
        }

        // lần bắt đầu đầu tiên
        start_date.setDate(start_date.getDate() + cycleDate);
        start_date.setMonth(start_date.getMonth() + cycleMonth);
        start_date.setFullYear(start_date.getFullYear() + cycleYear);
        const year = start_date.getFullYear();
        const month = start_date.getMonth() + 1;
        const day = start_date.getDate();
        let dayStartNewCycle = year + "-" + month + "-" + day; // ngày bắt đầu chu kì mới

        if (isAfter(new Date(dayStartNewCycle), new Date(end_date))) {
          cycleDate = cycleDate * 2;
        }

        if (dayStartNewCycle == end_date) {
          dayStartNewCycle = new Date(dayStartNewCycle);
          dayStartNewCycle.setDate(dayStartNewCycle.getDate() + 1);
          dayStartNewCycle =
            dayStartNewCycle.getFullYear() +
            "-" +
            (dayStartNewCycle.getMonth() + 1) +
            "-" +
            dayStartNewCycle.getDate();
          cycleDate = cycleDate * 2;
        }

        if (isBefore(new Date(dayStartNewCycle), new Date(end_date))) {
          let end_day = new Date(end_date);
          end_day.setDate(end_day.getDate() + 1);
          dayStartNewCycle =
            end_day.getFullYear() +
            "-" +
            (end_day.getMonth() + 1) +
            "-" +
            end_day.getDate();
          cycleDate = cycleDate * 2 + 1;
        }

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

    const rsTaskCusCared = taskCusCared.filter((value, index) => {
      let dayStartNewCycle2 = new Date(value.dayStartNewCycle2);
      let dayStartNewCycle = new Date(value.dayStartNewCycle);
      // console.log("Index", index);
      // console.log("Day 1", dayStartNewCycle);
      // console.log("Day 2", dayStartNewCycle2);

      let currentDay = new Date();
      if (value.customerId == cusWork.Customer._id) {
        return cusWork.Customer.Tasks.filter((task) => {
          let start_date = new Date(task.start_date);

          if (
            value.customerId == cusWork.Customer._id &&
            (isAfter(dayStartNewCycle2, currentDay) ||
              isEqual(dayStartNewCycle2, currentDay)) &&
            !isEqual(dayStartNewCycle2, start_date) &&
            !isEqual(dayStartNewCycle, start_date) &&
            task.Status_Task.name == "đã chăm sóc"
          ) {
            // console.log('Report ', task);
            return task;
          }
        });
      }
    });

    if (rsTaskCusCared.length > 0) {
      const filteredTasks = rsTaskCusCared.filter((taskCusCared) => {
        const matchingTasks = tasks.filter((task) => {
          return taskCusCared.customerId === task.customerId;
        });

        const hasOtherTasks = matchingTasks.some(
          // lấy
          (task) => task.Status_Task.name !== "đã chăm sóc"
        );

        if (hasOtherTasks) {
          return false; // Không trả về nếu có task khác đã chăm sóc
        }

        return taskCusCared;
      });

      // console.log("All tasks", filteredTasks);
      if (filteredTasks.length > 0) {
        return filteredTasks;
      }
    }
  });

  // console.log("data items in use index", data.items.length);
  return data.items.length;
};

// khách hàng tới chu kì nhưng chưa chăm sóc

export const countElementReportCustomerCyclePage = async () => {
  const cusWork = await http_getAll(Customer_Work);
  const tasks = await http_getAll(Task);
  data.items = cusWork.documents.filter((cusWork) => {
    const taskCusCared = cusWork.Customer.Tasks.filter((task) => {
      if (task.Status_Task.name == "đã chăm sóc") {
        const cycle = task.Cycle.name;
        let start_date = task.start_date;
        let end_date = task.end_date;
        // console.log(start_date);
        start_date = new Date(start_date);
        end_date = new Date(end_date);

        end_date =
          end_date.getFullYear() +
          "-" +
          (end_date.getMonth() + 1) +
          "-" +
          end_date.getDate();

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
          case cycle.includes("quý"):
            cycleDate = 90;
            break;
          case cycle.includes("quí"):
            cycleDate = 90;
            break;
        }

        start_date.setDate(start_date.getDate() + cycleDate);
        start_date.setMonth(start_date.getMonth() + cycleMonth);
        start_date.setFullYear(start_date.getFullYear() + cycleYear);

        const year = start_date.getFullYear();
        const month = start_date.getMonth() + 1;
        const day = start_date.getDate();
        let dayStartNewCycle = year + "-" + month + "-" + day; // ngày bắt đầu chu kì mới

        if (dayStartNewCycle == end_date) {
          // nếu ngày bắt đầu chu kì mới == end_date thì + 1
          dayStartNewCycle = new Date(dayStartNewCycle);
          dayStartNewCycle.setDate(dayStartNewCycle.getDate() + 1);
          dayStartNewCycle =
            dayStartNewCycle.getFullYear() +
            "-" +
            (dayStartNewCycle.getMonth() + 1) +
            "-" +
            dayStartNewCycle.getDate();
        }

        if (isBefore(new Date(dayStartNewCycle), new Date(end_date))) {
          let end_day = new Date(end_date);
          end_day.setDate(end_day.getDate() + 1);
          dayStartNewCycle =
            end_day.getFullYear() +
            "-" +
            (end_day.getMonth() + 1) +
            "-" +
            end_day.getDate();
        }

        // console.log("Start date: ", start_date);
        // console.log("Cycle", cycle);
        // console.log("Day start new cycle", dayStartNewCycle);

        task.dayStartNewCycle = dayStartNewCycle;
        return task;
      }
    });

    const rsTaskCusCared = taskCusCared.filter((value, index) => {
      let dayStartNewCycle = new Date(value.dayStartNewCycle);
      // console.log("Index", index);
      // console.log("Day 1", dayStartNewCycle);

      let currentDay = new Date();
      if (value.customerId == cusWork.Customer._id) {
        return cusWork.Customer.Tasks.filter((task) => {
          let start_date = new Date(task.start_date);

          if (
            value.customerId == cusWork.Customer._id &&
            !isEqual(dayStartNewCycle, start_date) &&
            task.Status_Task.name == "đã chăm sóc"
          ) {
            return task;
          }
        });
      }
    });

    if (rsTaskCusCared.length > 0) {
      const filteredTasks = rsTaskCusCared.filter((taskCusCared) => {
        const matchingTasks = tasks.filter((task) => {
          return taskCusCared.customerId === task.customerId;
        });

        const hasOtherTasks = matchingTasks.some(
          // lấy
          (task) => task.Status_Task.name !== "đã chăm sóc"
        );

        if (hasOtherTasks) {
          return false; // Không trả về nếu có task khác đã chăm sóc
        }

        return taskCusCared;
      });

      // console.log("All tasks", filteredTasks);
      if (filteredTasks.length > 0) {
        return filteredTasks;
      }
    }
  });

  return data.items.length;
};

// khách hàng do nhân viên chăm sóc

export const countElementReportAssignmentStaff = async () => {
  const tasks = await http_getAll(Task);
  const ListTaskId = [];
  const arrTasks = [];
  tasks.map((task) => {
    ListTaskId.push(task._id);
  });

  for (const _id of ListTaskId) {
    const rs = await http_getOne(Task, _id);
    console.log("rs", rs.Employees.length);
    if (rs.Employees.length > 0) {
      arrTasks.push(rs);
    }
  }

  return arrTasks.length;
};

// khách hàng do lảnh đạo phụ trách
export const countElementReportLeaderCustomer = async () => {
  const leaderId = sessionStorage.getItem("employeeId");

  const tasks = await http_getAll(Task);
  const ListTaskId = [];
  const arrTasks = [];
  tasks.map((task) => {
    ListTaskId.push(task._id);
  });

  for (const _id of ListTaskId) {
    const rs = await http_getOne(Task, _id);
    arrTasks.push(rs);
  }

  return arrTasks.filter((item, index, self) => {
    return (
      item.leaderId == leaderId &&
      index ===
        self.findIndex((customer) => customer.Customer._id === item.customerId)
    );
  }).length;
};

// nhân viên do lảnh đạo phụ trách
export const countElementReportLeaderStaff = async () => {
  const leaderId = sessionStorage.getItem("employeeId");
  const tasks = await http_getAll(Task);

  const ListTaskId = [];
  let arrayEmployess = [];
  tasks.map((task) => {
    ListTaskId.push(task._id);
  });

  for (const _id of ListTaskId) {
    const rs = await http_getOne(Task, _id);
    arrayEmployess.push(rs);
  }

  arrayEmployess = arrayEmployess.map((item) => {
    const array = [...item.Employees];
    if (array.length > 0) {
      return array;
    }
  });

  arrayEmployess = arrayEmployess.filter((item) => {
    return item !== undefined;
  });

  const newarrayEmployess = arrayEmployess.flatMap((item) => item); // chuyển mảng 2 chiều thành mảng 1 chiều

  return newarrayEmployess.filter((item, index, self) => {
    return index === self.findIndex((value) => value._id === item._id); // lọc ra các nhân viên trùng nhau
  }).length;
};