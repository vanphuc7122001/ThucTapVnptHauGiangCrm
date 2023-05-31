import { createWebHistory, createRouter } from "vue-router";

const routes = [
  // Dashboard
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/dashboard/index.vue'),
  },
  // Customer
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('../views/customer/index.vue'),
  },
  {
    path: '/customer/:id',
    name: 'Customer.view',
    component: () => import('../views/customer/view.vue'),
    props: true,
  },
  // Customer Types
  {
    path: '/customer_types',
    name: 'Customer_Types',
    component: () => import('../views/customer-types/index.vue'),
  },
  {
    path: '/customer_types/:id',
    name: 'Customer_Types.view',
    component: () => import('../views/customer-types/view.vue'),
    props: true,
  },
  // Activity 
  {
    path: '/event',
    name: 'Event',
    component: () => import('../views/event/index.vue'),
  },
  {
    path: '/event/:id',
    name: 'Event.view',
    component: () => import('../views/event/view.vue'),
    props: true,
  },
  // Habit
  {
    path: '/habit',
    name: 'Habit',
    component: () => import('../views/habit/index.vue'),
  },
  {
    path: '/habit/:id',
    name: 'Habit.view',
    component: () => import('../views/habit/view.vue'),
    props: true,
  },
  // Employee 
  {
    path: '/employee',
    name: 'Employee',
    component: () => import('../views/employee/index.vue'),
  },
  {
    path: '/employee/:id',
    name: 'Employee.view',
    component: () => import('../views/employee/view.vue'),
  },
  // Position 
  {
    path: '/position',
    name: 'Position',
    component: () => import('../views/position/index.vue'),
  },
  {
    path: '/position/:id',
    name: 'Position.view',
    component: () => import('../views/position/view.vue'),
  },
  // Unit 
  {
    path: '/unit',
    name: 'Unit',
    component: () => import('../views/unit/unit.vue'),
  },
  {
    path: '/unit/:id',
    name: 'Unit.view',
    component: () => import('../views/unit/index.vue'),
  },
  // Level
  {
    path: '/level',
    name: 'Level',
    component: () => import('../views/unit/index.vue'),
  },
  {
    path: '/level/:id',
    name: 'Level.view',
    component: () => import('../views/level/index.vue'),
  },
  // Assignment
  {
    path: '/assignment',
    name: 'Assignment',
    component: () => import('../views/assignment/index.vue'),
  },
  {
    path: '/assignment/:id',
    name: 'Assignment.view',
    component: () => import('../views/assignment/view.vue'),
    props: true,
  },
  {
    path: '/assignment/:id/appointment',
    name: 'Assignment.appointment',
    component: () => import('../views/appointment/index.vue'),
    props: true,
  },
  // Account
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/account/index.vue'),
    
  },
  //AccountList.vue
  // {
  //   path:'/accountlist',
  //   name: 'AccountList',
  //   component: () => import('../views/account/AccountList.vue'),
  // },
  //permissionlist.vue
  {
    path: '/permissionlist',
    name: 'PermissionList',
    component: () => import('../views/account/PermissionList.vue')
  },
  //rolelist.vue
  {
    path: '/rolelist',
    name: 'RoleList',
    component: () => import('../views/account/RoleList.vue')
  },
  //view account
  {
    path: '/account/:id',
    name: 'AccountList.view',
    component: () => import('../views/account/view.vue'),
    props: true,
  },
  // view role
  {
    path: '/rolelist/:id',
    name: 'RoleList.view',
    component: () => import('../views/account/view.vue'),
    props: true,
  }, 
  // view permission
  {
    path: '/permissionlist/:id',
    name: 'PermissionList.view',
    component: () => import('../views/account/view.vue'),
    props: true,
  },
  // Report
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/report/index.vue'),
  },
  // Setting
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/setting/index.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
