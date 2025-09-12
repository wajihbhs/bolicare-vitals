<script setup lang="ts">
import { watch } from "vue";
import { usePatientsStore } from "../stores/patients";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

const store = usePatientsStore();
const { t } = useI18n();
const toast = useToast();

watch(
    () => store.alerts.slice(),
    (alerts) => {
      if (!alerts.length) return;

      alerts.forEach((alert) => {
        const { patient, type, value } = alert;
        const name = `${patient.firstName} ${patient.lastName}`;

        let message = "";
        let options: any = { type: "info", timeout: 5000 };

        switch (type) {
          case "temperature":
            message = t("alerts.messages.temperature", { name, value });
            options.type = alert.level === "critical" ? "error" : "warning";
            options.timeout = alert.level === "critical" ? 15000 : 5000;
            break;
          case "heartRate":
            message = t("alerts.messages.heart-rate", { name, value });
            options.type = alert.level === "critical" ? "error" : "warning";
            options.timeout = alert.level === "critical" ? 15000 : 5000;
            break;
          case "bloodPressure":
            message = t("alerts.messages.blood-pressure", { name, value });
            options.type = alert.level === "critical" ? "error" : "warning";
            options.timeout = alert.level === "critical" ? 15000 : 5000;
            break;
          default:
            message = t("alerts.messages.default", { name, value });
            options.type = "info";
            options.timeout = 5000;
        }

        toast(message, options);
      });

      setTimeout(() => {
        store.alerts.splice(0, store.alerts.length);
      });
    },
    { deep: true }
);
</script>
