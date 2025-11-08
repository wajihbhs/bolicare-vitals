import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { Alert, Patient } from "../types";
import { CRITICAL_STATUS, STABLE_STATUS, WATCH_STATUS } from "../types";

/**
 * @description
 * Pinia store to manage patients data and alerts.
 * This store handles fetching patients, updating patient data,
 * computing patient status based on vitals, and generating alerts.
 *
 * @store
 * usePatientsStore
 */
export const usePatientsStore = defineStore("patients", () => {
  const patients = ref<Patient[]>([]);

  /** Loading state for async operations */
  const loading = ref(false);

  /** List of alerts generated based on patient vitals */
  const alerts = ref<Alert[]>([]);

  /**
   * @description
   * Fetch all patients from the API.
   * Sets loading state and updates the patients array.
   * Also triggers alerts check after fetching data.
   */
  async function fetchPatients() {
    loading.value = true;
    try {
      const res = await axios.get("/api/patients");
      // Simulate network delay for UX purposes
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

  /**
   * @description
   * Update a patient's data via API.
   * Replaces patient in local state and triggers alerts check.
   * @param updated - The updated patient object
   * @returns Updated patient data from API
   */
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

  /**
   * @description
   * Get the last recorded value from an array of vitals.
   * @param vitalValue - Array of vital measurements
   * @returns Last vital value or null if empty
   */
  const lastVitalRate = (vitalValue: any) => {
    return vitalValue && vitalValue.length ? vitalValue[vitalValue.length - 1] : null;
  };

  /**
   * @description
   * Compute patient status based on vitals and age.
   * Status can be STABLE, WATCH, or CRITICAL.
   * @param p - Patient object
   * @returns Patient status string
   */
  const getPatientStatus = (p: Patient): string => {
    const { heartRate, temperature, bloodPressure } = p.vitals;
    const hr = lastVitalRate(heartRate) ?? 0;
    const temp = lastVitalRate(temperature) ?? 0;
    const bp = lastVitalRate(bloodPressure) ?? { systolic: 0, diastolic: 0 };

    const { age } = p;
    const isElderly = age >= 65;
    const isChild = age < 18;

    // Critical thresholds
    if (temp < 29 || temp > 42.6 || hr <= 0) return CRITICAL_STATUS;
    if (hr < 40 || hr > 180) return CRITICAL_STATUS;
    if (bp.systolic < 80 || bp.systolic > 200 || bp.diastolic < 50 || bp.diastolic > 120)
      return CRITICAL_STATUS;

    // Watch thresholds based on age
    const hrRange = isElderly ? [70, 90] : isChild ? [80, 120] : [60, 80];
    const bpRange = isElderly
        ? { systolic: [150, 170], diastolic: [90, 110] }
        : { systolic: [120, 140], diastolic: [60, 80] };
    const tempRange = [36.3, 37.9];

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

  /**
   * @description
   * Generate alerts for all patients based on their current vitals.
   * Populates the `alerts` array with patient, type, value, and level.
   */
  const checkAlerts = () => {
    alerts.value = [];
    for (const p of patients.value) {
      const status = getPatientStatus(p);
      const hr = lastVitalRate(p.vitals.heartRate);
      const temp = lastVitalRate(p.vitals.temperature);
      const bp = lastVitalRate(p.vitals.bloodPressure);

      if (!hr && !temp && !bp) continue;

      if (status === CRITICAL_STATUS) {
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
      } else if (status === WATCH_STATUS) {
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
