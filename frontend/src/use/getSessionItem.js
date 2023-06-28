const role = sessionStorage.getItem("role");
let permissionList = sessionStorage.getItem("permissionList");
permissionList = JSON.parse(permissionList);
// console.log("permissionList", permissionList);

// khách hàng
const isDeleteCustomer = () => {
  return permissionList.includes("xoá khách hàng");
};
const isEditCustomer = () => {
  return permissionList.includes("sửa thông tin khách hàng");
};
const isReadCustomer = () => {
  return permissionList.includes("xem thông tin khách hàng");
};
const isCreateCustomer = () => {
  return permissionList.includes("thêm thông tin khách hàng");
};

// nhân viên
const isDeleteEmployee = () => {
  return permissionList.includes("xoá nhân viên");
};
const isEditEmployee = () => {
  return permissionList.includes("sửa thông tin nhân viên");
};
const isReadEmployee = () => {
  return permissionList.includes("xem nhân viên");
};
const isCreateEmployee = () => {
  return permissionList.includes("thêm thông tin nhân viên");
};

// Sự kiện
const isDeleteEvent = () => {
  return permissionList.includes("xóa sự kiện");
};
const isEditEvent = () => {
  return permissionList.includes("sửa sự kiện");
};
const isCreateEvent = () => {
  return permissionList.includes("thêm sự kiện");
};
const isReadEvent = () => {
  return permissionList.includes("xem sự kiện");
};

const isSetEvent = () => {
  return permissionList.includes("áp dụng sự kiện");
};

// Thói quen
const isDeleteHabit = () => {
  return permissionList.includes("xóa thói quen");
};
const isEditHabit = () => {
  return permissionList.includes("sửa thói quen");
};
const isCreateHabit = () => {
  return permissionList.includes("thêm thói quen");
};
const isReadHabit = () => {
  return permissionList.includes("xem thói quen");
};

const isSetHabit = () => {
  return permissionList.includes("áp dụng thói quen");
};

// Phân công
const isDeleteAssignement = () => {
  return permissionList.includes("xóa phân công");
};
const isEditAssignement = () => {
  return permissionList.includes("sửa phân công");
};
const isCreateAssignement = () => {
  return permissionList.includes("thêm phân công");
};
const isReadAssignement = () => {
  return permissionList.includes("xem phân công");
};
const isSelfAssignement = () => {
  return permissionList.includes("tự phân công");
};
const isSetAssignement = () => {
  return permissionList.includes("giao phân công");
};
const isFeedbackAssignment = () => {
  return permissionList.includes("thêm đánh giá phân công");
};

const isReNewAssignment = () => {
  return permissionList.includes("tái phân công");
};

// lịch hẹn
const isDeleteAppointment = () => {
  return permissionList.includes("xóa lịch hẹn");
};
const isCreateAppointment = () => {
  return permissionList.includes("thêm lịch hẹn");
};
const isEditAppointment = () => {
  return permissionList.includes("sửa lịch hẹn");
};
const isReadAppointment = () => {
  return permissionList.includes("xem lịch hẹn");
};

// Thống kê
const isReadDashboard = () => {
  return permissionList.includes("xem thống kê");
};

// Báo cáo
const isReadReport = () => {
  return permissionList.includes("báo cáo khách hàng lâu chưa chăm sóc");
};

const isReadReportLeaderCustomer = () => {
  return permissionList.includes("báo cáo khách hàng do lãnh đạo phụ trách");
};

const isReadReportLeaderStaff = () => {
  return permissionList.includes("báo cáo nhân viên do lãnh đạo phụ trách");
};

const isReadReportCustomerCycle = () => {
  return permissionList.includes(
    "báo cáo khách hàng tới chu kì nhưng chưa chăm sóc"
  );
};

const isReadReportAssinmentStaff = () => {
  return permissionList.includes("báo cáo khách hàng do nhân viên chăm sóc");
};

const isPrintReport = () => {
  return permissionList.includes("in báo cáo");
};

// Mail
const isMail = () => {
  return permissionList.includes("gửi mail");
};

// Tài khoản
const isReadAccount = () => {
  return permissionList.includes("xem tài khoản");
};

// Vai trò
const isReadRole = () => {
  return permissionList.includes("xem vai trò");
};
const isCreateRole = () => {
  return permissionList.includes("thêm vai trò");
};
const isDeleteRole = () => {
  return permissionList.includes("xóa vai trò");
};
const isSetRole = () => {
  return permissionList.includes("áp dụng vai trò");
};

// quyền
const isCreatePermission = () => {
  return permissionList.includes("thêm quyền");
};
const isDeletePermission = () => {
  return permissionList.includes("xóa quyền");
};
const isReadPermission = () => {
  return permissionList.includes("xem quyền");
};
const isSetPermission = () => {
  return permissionList.includes("áp dụng quyền");
};

export {
  role,
  permissionList,
  // Khách hàng
  isDeleteCustomer,
  isEditCustomer,
  isReadCustomer,
  isCreateCustomer,
  // Nhân viên
  isDeleteEmployee,
  isEditEmployee,
  isReadEmployee,
  isCreateEmployee,
  // sự kiện
  isDeleteEvent,
  isEditEvent,
  isCreateEvent,
  isReadEvent,
  isSetEvent,
  // thói quen
  isDeleteHabit,
  isEditHabit,
  isCreateHabit,
  isReadHabit,
  isSetHabit,
  // phân công
  isDeleteAssignement,
  isEditAssignement,
  isCreateAssignement,
  isReadAssignement,
  isSelfAssignement,
  isSetAssignement,
  isFeedbackAssignment,
  isReNewAssignment,
  // lịch hẹn
  isDeleteAppointment,
  isCreateAppointment,
  isEditAppointment,
  isReadAppointment,
  // Thống kê
  isReadDashboard,
  // báo cáo
  isReadReport,
  isReadReportLeaderCustomer,
  isReadReportLeaderStaff,
  isReadReportCustomerCycle,
  isReadReportAssinmentStaff,
  isPrintReport,
  // mail
  isMail,
  // Tài khoản
  isReadAccount,
  // vai trò
  isReadRole,
  isCreateRole,
  isDeleteRole,
  isSetRole,
  // quyền
  isCreatePermission,
  isDeletePermission,
  isReadPermission,
  isSetPermission,
};
