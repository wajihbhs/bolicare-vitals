export const CRITICAL_STATUS = "critical";
export const STABLE_STATUS = "stable";
export const WATCH_STATUS = "watch";

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface Alert {
  patient: Patient;
  type: "global" | "temperature" | "heartRate" | "bloodPressure";
  value?: number | string;
  level: "critical" | "watch";
}

export interface Vitals {
  heartRate: number[];
  temperature: number[];
  bloodPressure: BloodPressure[];
  oxygenSaturation: number[];
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  medicalRecordNumber: string;
  vitals: Vitals;
}
