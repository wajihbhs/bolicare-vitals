import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { Alert, Patient } from "../types";
import { CRITICAL_STATUS, STABLE_STATUS, WATCH_STATUS } from "../types";

export const usePatientsStore = defineStore("patients", () => {
  const patients = ref<Patient[]>([]);
  const loading = ref(false);
  const alerts = ref<Alert[]>([]);

  async function fetchPatients() {
    loading.value = true;
    try {
      const res = await axios.get("/api/patients");
      setTimeout(() => {
        patients.value = res.data || [];
        loading.value = false;
        checkAlerts();
      }, 2000);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      loading.value = false;
    }
  }

  async function updatePatient(updated: Patient) {
    try {
      const res = await axios.put(`/api/patients/${updated.id}`, updated);
      const index = patients.value.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        patients.value[index] = res.data;
        checkAlerts();
      }
      return res.data;
    } catch (err) {
      console.error("Failed to update patient:", err);
      throw err;
    }
  }

  const lastVitalRate = (vitalValue: any) => {
    return vitalValue && vitalValue.length ? vitalValue[vitalValue.length - 1] : null;
  };

  const getPatientStatus = (p: Patient): string => {
    const { heartRate, temperature, bloodPressure } = p.vitals;
    const hr = lastVitalRate(heartRate) ?? 0;
    const temp = lastVitalRate(temperature) ?? 0;
    const bp = lastVitalRate(bloodPressure) ?? { systolic: 0, diastolic: 0 };

    const { age } = p;
    const isElderly = age >= 65;
    const isChild = age < 18;

    if (temp < 29 || temp > 42.6 || hr <= 0) return CRITICAL_STATUS;
    if (hr < 40 || hr > 180) return CRITICAL_STATUS;
    if (bp.systolic < 80 || bp.systolic > 200 || bp.diastolic < 50 || bp.diastolic > 120)
      return CRITICAL_STATUS;

    const hrRange = isElderly ? [70, 90] : isChild ? [80, 120] : [60, 80];
    const bpRange = isElderly
        ? { systolic: [150, 170], diastolic: [90, 110] }
        : { systolic: [120, 140], diastolic: [60, 80] };
    const tempRange = [36.3, 37.5];

    if (
        hr < hrRange[0] || hr > hrRange[1] ||
        bp.systolic < bpRange.systolic[0] || bp.systolic > bpRange.systolic[1] ||
        bp.diastolic < bpRange.diastolic[0] || bp.diastolic > bpRange.diastolic[1] ||
        temp < tempRange[0] || temp > tempRange[1]
    ) {
      return WATCH_STATUS;
    }

    return STABLE_STATUS;
  };

  const checkAlerts = () => {
    alerts.value = [];
    for (const p of patients.value) {
      const st = getPatientStatus(p);
      const hr = lastVitalRate(p.vitals.heartRate);
      const temp = lastVitalRate(p.vitals.temperature);
      const bp = lastVitalRate(p.vitals.bloodPressure);

      if (!hr && !temp && !bp) continue;

      if (st === CRITICAL_STATUS) {
        if (temp < 29 || temp > 42.6)
          alerts.value.push({ patient: p, type: "temperature", value: temp, level: CRITICAL_STATUS });
        if (hr <= 0 || hr < 40 || hr > 180)
          alerts.value.push({ patient: p, type: "heartRate", value: hr, level: CRITICAL_STATUS });
        if (bp)
          alerts.value.push({
            patient: p,
            type: "bloodPressure",
            value: `${bp.systolic}/${bp.diastolic}`,
            level: CRITICAL_STATUS,
          });
      } else if (st === WATCH_STATUS) {
        const hrRange = p.age >= 65 ? [70, 90] : p.age < 18 ? [80, 120] : [60, 80];
        const bpRange = p.age >= 65 ? { systolic: [150, 170], diastolic: [90, 110] } : { systolic: [120, 140], diastolic: [60, 80] };
        const tempRange = [36.3, 37.5];

        if (temp && (temp < tempRange[0] || temp > tempRange[1]))
          alerts.value.push({ patient: p, type: "temperature", value: temp, level: WATCH_STATUS });

        if (hr && (hr < hrRange[0] || hr > hrRange[1]))
          alerts.value.push({ patient: p, type: "heartRate", value: hr, level: WATCH_STATUS });

        if (bp && (bp.systolic < bpRange.systolic[0] || bp.systolic > bpRange.systolic[1] || bp.diastolic < bpRange.diastolic[0] || bp.diastolic > bpRange.diastolic[1]))
          alerts.value.push({ patient: p, type: "bloodPressure", value: `${bp.systolic}/${bp.diastolic}`, level: WATCH_STATUS });
      }
    }
  };

  return {
    patients,
    loading,
    alerts,
    fetchPatients,
    updatePatient,
    lastVitalRate,
    getPatientStatus,
    checkAlerts,
  };
});
