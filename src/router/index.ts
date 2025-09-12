import PatientList from "../views/patient/PatientList.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [{ path: "/", name: "patients", component: PatientList }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
