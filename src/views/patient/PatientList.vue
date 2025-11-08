<template>
  <v-container>
    <!-- Search input for filtering patients -->
    <v-text-field
        v-model="search"
        :placeholder="$t('views.patients.search-placeholder')"
    >
      <template #append>
        <v-icon>mdi-magnify</v-icon>
      </template>
    </v-text-field>

    <!-- Loading state: skeletons -->
    <v-row v-if="store.loading">
      <v-col cols="12" md="4" v-for="n in 6" :key="n">
        <v-skeleton-loader type="card" class="pa-3" />
      </v-col>
    </v-row>

    <!-- Patients list -->
    <v-row v-else>
      <v-col cols="12" md="4" v-for="p in filtered" :key="p.id">
        <v-card class="pa-3">
          <v-row align="center">
            <!-- Avatar -->
            <v-col cols="4">
              <v-img
                  :src="`https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&size=128&background=random`"
                  aspect-ratio="1"
                  class="rounded"
              />
            </v-col>

            <!-- Patient info -->
            <v-col cols="8">
              <div class="text-h6">{{ p.firstName }} {{ p.lastName }}</div>
              <div class="text-subtitle-2">MRN: {{ p.medicalRecordNumber }}</div>
              <div class="d-flex align-center justify-space-between w-75">
                <span :class="`text-capitalize text-${statusColor(p)}`">
                  {{ $t(`views.patients.status.${store.getPatientStatus(p)}`) }}
                </span>
                <v-badge :color="statusColor(p)" rounded />
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-2" />

          <!-- Vitals summary -->
          <div class="d-flex justify-center">
            HR: {{ store.lastVitalRate(p.vitals.heartRate) }} bpm — Temp:
            {{ store.lastVitalRate(p.vitals.temperature) }}°C
          </div>

          <v-divider class="my-2" />

          <!-- Actions -->
          <v-card-actions class="justify-center">
            <base-button color="primary" variant="tonal" uppercase @click="openEditDialog(p)">
              <v-icon start>mdi-pencil</v-icon>
              {{ $t("actions.update") }}
            </base-button>
            <base-button color="secondary" variant="tonal" uppercase @click="openDetailsDialog(p)">
              <v-icon start>mdi-pencil</v-icon>
              {{ $t("actions.details") }}
            </base-button>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Edit patient dialog -->
  <patient-dialog-edit
      v-model="editDialogOpen"
      :patient="selectedPatient"
      :title="$t('form.titles.edit-patient')"
      @save="handleSave"
  />

  <!-- Patient details dialog -->
  <patient-dialog-details
      v-model="detailsDialogOpen"
      :patient="selectedPatient"
  />
</template>

<script setup lang="ts">
import type { Patient } from "../../types";
import { CRITICAL_STATUS, WATCH_STATUS } from "../../types";
import { useIntervalFn } from "@vueuse/core";
import {computed, defineAsyncComponent, onMounted, ref} from "vue";
import { usePatientsStore } from "../../stores/patients.ts";

const PatientDialogEdit = defineAsyncComponent(() => import("./PatientDialogEdit.vue"));
const PatientDialogDetails = defineAsyncComponent(() => import("./PatientDialogDetails.vue"));
/**
 * @description Patients list store
 */
const store = usePatientsStore();

/** Search string for filtering patients */
const search = ref("");

/** State for edit dialog visibility */
const editDialogOpen = ref(false);

/** Currently selected patient for edit or details */
const selectedPatient = ref<Patient | null>(null);

/** State for details dialog visibility */
const detailsDialogOpen = ref(false);

/**
 * @description Open the patient details dialog
 * @param p Patient to view
 */
const openDetailsDialog = (p: Patient) => {
  selectedPatient.value = p;
  detailsDialogOpen.value = true;
};

/**
 * @description Open the patient edit dialog
 * @param p Patient to edit
 */
const openEditDialog = (p: Patient) => {
  selectedPatient.value = p;
  editDialogOpen.value = true;
};

/**
 * @description Computed filtered patients list based on search string
 */
const filtered = computed((): Patient[] =>
    store.patients.filter((p) => {
      const patientToSearch =
          `${p.firstName} ${p.lastName} ${p.medicalRecordNumber}`.toLowerCase();
      return patientToSearch.includes(search.value.toLowerCase());
    })
);

/**
 * @description Returns a color string based on patient status
 * @param p Patient
 * @returns 'red' | 'orange' | 'green'
 */
const statusColor = (p: Patient) => {
  const s = store.getPatientStatus(p);
  return s === CRITICAL_STATUS
      ? "red"
      : s === WATCH_STATUS
          ? "orange"
          : "green";
};

/**
 * @description Handle saving of updated patient
 * @param updated Updated patient object
 */
const handleSave = async (updated: Patient) => {
  try {
    await store.updatePatient(updated);
  } catch (err) {
    console.error("Save failed:", err);
  }
};

/** Fetch patients when component mounts */
onMounted(() => {
  store.fetchPatients();
});

/** Refresh patients list every 60 seconds */
useIntervalFn(() => {
  store.fetchPatients();
}, 60000);
</script>
