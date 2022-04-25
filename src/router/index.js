import Vue from "vue";
import VueRouter from "vue-router";
import VaccineList from "@/views/VaccineList";
import VaccinationSchedule from "@/views/VaccinationSchedule";
import VaccinationPeriod from "@/views/VaccinationPeriod";
import LoginView from "@/views/LoginView";
import CreateAccount from "@/views/CreateAccount";
import NotLogin from "@/views/notLogin"


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/createAccount",
    name: "CreateAccount",
    component: CreateAccount,
  },
  {
    path: "/vaccineList",
    name: "VaccineList",
    component: VaccineList,
  },
  {
    path: "/schedule",
    name: "VaccinationSchedule",
    component: VaccinationSchedule,
  },
  {
    path: "/vaccinationPeriod",
    name: "VaccinationPeriod",
    component: VaccinationPeriod,
  },
  {
    path: "/notLogin",
    name: "NotLogin",
    component: NotLogin,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
