import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/admin",
    alias: "/login",
    name: "Login",
    component: () => import("../../src/login.vue"),
  },
  {
    path: "/",
    component: () => import("../../src/HomePage.vue"),
    meta: { requiresAuth: true }, // Bạn có thể sử dụng meta để đánh dấu các trang yêu cầu xác thực
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("../views/dashboard/index.vue"),
      },
      {
        path: "customer",
        name: "Customer",
        component: () => import("../views/customer/index.vue"),
      },
      {
        path: "/customer/:id",
        name: "Customer.view",
        component: () => import("../views/customer/view.vue"),
        props: true,
      },
      {
        path: "customer_types",
        name: "Customer_Types",
        component: () => import("../views/customer-types/index.vue"),
      },
      {
        path: "/customer_types/:id",
        name: "Customer_Types.view",
        component: () => import("../views/customer-types/view.vue"),
        props: true,
      },
      {
        path: "event",
        name: "Event",
        component: () => import("../views/event/index.vue"),
      },
      {
        path: "/event/:id",
        name: "Event.view",
        component: () => import("../views/event/view.vue"),
        props: true,
      },
      {
        path: "habit",
        name: "Habit",
        component: () => import("../views/habit/index.vue"),
      },
      {
        path: "/habit/:id",
        name: "Habit.view",
        component: () => import("../views/habit/view.vue"),
        props: true,
      },
      {
        path: "employee",
        name: "Employee",
        component: () => import("../views/employee/index.vue"),
      },
      {
        path: "/employee/:id",
        name: "Employee.view",
        component: () => import("../views/employee/view.vue"),
      },
      // Position
      {
        path: "position",
        name: "Position",
        component: () => import("../views/position/index.vue"),
      },
      {
        path: "/position/:id",
        name: "Position.view",
        component: () => import("../views/position/view.vue"),
      },
      {
        path: "/unit",
        name: "Unit",
        component: () => import("../views/unit/unit.vue"),
      },
      {
        path: "/unit/:id",
        name: "Unit.view",
        component: () => import("../views/unit/index.vue"),
      },
      // Level
      {
        path: "level",
        name: "Level",
        component: () => import("../views/unit/index.vue"),
      },
      {
        path: "/level/:id",
        name: "Level.view",
        component: () => import("../views/level/index.vue"),
      },
      // Assignment
      {
        path: "assignment",
        name: "Assignment",
        component: () => import("../views/assignment/index.vue"),
      },
      {
        path: "/assignment/:id",
        name: "Assignment.view",
        component: () => import("../views/assignment/view.vue"),
        props: true,
      },
      {
        path: "/assignment/:id/appointment",
        name: "Assignment.appointment",
        component: () => import("../views/appointment/index.vue"),
        props: true,
      },
      // Account
      {
        path: "account",
        name: "Account",
        component: () => import("../views/account/index.vue"),
      },
      {
        path: "permission",
        name: "Permission",
        component: () => import("../views/permission/index.vue"),
      },
      //rolelist.vue
      {
        path: "role",
        name: "Role",
        component: () => import("../views/role/index.vue"),
      },
      // Report
      {
        path: "report",
        name: "Report",
        component: () => import("../views/report/index.vue"),
      },
      {
        path: "report_assignment_staff",
        name: "ReportAssignment",
        component: () =>
          import("../views/report/report_assignment_staff/index.vue"),
      },
      // Report customer cycle
      {
        path: "report_customer_cycle",
        name: "ReportCustomerCycle",
        component: () =>
          import("../views/report/report_customer_cycle/index.vue"),
      },
      // Reporting customer is managed by the leader
      {
        path: "report_leader_customer",
        name: "ReportLeaderCustomer",
        component: () =>
          import("../views/report/leader/leader_customer/index.vue"),
      },
      // Reporting staff is managed by the leader
      {
        path: "report_leader_staff",
        name: "ReportLeaderStaff",
        component: () =>
          import("../views/report/leader/leader_staff/index.vue"),
      },
      // Setting
      {
        path: "setting",
        name: "Setting",
        component: () => import("../views/setting/index.vue"),
      },
      {
        path: "task/:id/appointment",
        name: "Task.appointment",
        component: () => import("../views/appointment/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("token"); // Kiểm tra xem người dùng đã đăng nhập hay chưa
  console.log(`isAuthenticated `, isAuthenticated);
  const customerId = sessionStorage.getItem("customerId");
  const customerName = sessionStorage.getItem("customerName");
  const role = sessionStorage.getItem("role");
  console.log(customerId, customerName, role);
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    next({ name: "Login" });
  } else {
    next();
  }
});
export default router;
