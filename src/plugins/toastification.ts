import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  install(app: any) {
    app.use(Toast, {
      position: POSITION.TOP_RIGHT,
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      hideProgressBar: false,
      transition: "Vue-Toastification__fade",
    });
  },
};
