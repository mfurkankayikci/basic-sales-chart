import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import VueApexCharts from "vue3-apexcharts";
import axios from "axios";
import "./styles/main.scss";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(VueApexCharts);
app.use(router);
app.mount("#app");
