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
  // Employee 
  {
    path: '/employee',
    name: 'Employee',
    component: () => import('../views/employee/index.vue'),
  },
  // Unit 
  {
    path: '/unit',
    name: 'Unit',
    component: () => import('../views/unit/index.vue'),
  },
  // Level
  {
    path: '/level',
    name: 'Level',
    component: () => import('../views/level/index.vue'),
  },
  // Assignment
  {
    path: '/assignment',
    name: 'Assignment',
    component: () => import('../views/assignment/index.vue'),
  },
  // Appointment
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('../views/appointment/index.vue'),
  },
  // Account
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/account/index.vue'),
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
