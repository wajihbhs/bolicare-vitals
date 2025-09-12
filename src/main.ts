import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import { i18n } from "./plugins/i18n";
import VueApexCharts from "vue3-apexcharts";
import ToastPlugin from "./plugins/toastification";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(ToastPlugin);
app.use(VueApexCharts);

app.mount("#app");
