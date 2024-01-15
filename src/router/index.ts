import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import ResultPage from "../views/ResultPage.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/result",
    name: "Result",
    component: ResultPage,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
