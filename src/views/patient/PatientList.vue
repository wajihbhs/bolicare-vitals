<template>
  <v-container>
    <v-text-field
      v-model="search"
      :placeholder="$t('views.patients.search-placeholder')"
    >
      <template #append>
        <v-icon>mdi-magnify</v-icon>
      </template>
    </v-text-field>
    <v-row v-if="store.loading">
      <v-col cols="12" md="4" v-for="n in 6" :key="n">
        <v-skeleton-loader type="card" class="pa-3" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="4" v-for="p in filtered" :key="p.id">
        <v-card class="pa-3">
          <v-row align="center">
            <v-col cols="4">
              <v-img
                :src="`https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&size=128&background=random`"
                aspect-ratio="1"
                class="rounded"
              />
            </v-col>
            <v-col cols="8">
              <div class="text-h6">{{ p.firstName }} {{ p.lastName }}</div>
              <div class="text-subtitle-2">
                MRN: {{ p.medicalRecordNumber }}
              </div>
              <div class="d-flex align-center justify-space-between w-75">
                <span :class="`text-capitalize text-${statusColor(p)}`">
                  {{ $t(`views.patients.status.${store.getPatientStatus(p)}`) }}
                </span>
                <v-badge :color="statusColor(p)" rounded />
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="d-flex justify-center">
            HR: {{ store.lastVitalRate(p.vitals.heartRate) }} bpm — Temp:
            {{ store.lastVitalRate(p.vitals.temperature) }}°C
          </div>
          <v-divider class="my-2" />
          <v-card-actions class="justify-center">
            <v-btn color="primary" variant="tonal" @click="openEditDialog(p)">
              <v-icon start>mdi-pencil</v-icon>
              {{ $t("actions.update") }}
            </v-btn>
            <v-btn
              color="secondary"
              variant="tonal"
              @click="openDetailsDialog(p)"
            >
              <v-icon start>mdi-chart-line</v-icon>
              {{ $t("actions.details") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <patient-dialog-edit
    v-model="editDialogOpen"
    :patient="selectedPatient"
    :title="$t('form.titles.edit-patient')"
    @save="handleSave"
  />
  <patient-dialog-details
    v-model="detailsDialogOpen"
    :patient="selectedPatient"
  />
</template>

<script setup lang="ts">
import type { Patient } from "../../types";
import { CRITICAL_STATUS, WATCH_STATUS } from "../../types";
import { useIntervalFn } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { usePatientsStore } from "../../stores/patients.ts";
import PatientDialogEdit from "./PatientDialogEdit.vue";
import PatientDialogDetails from "./PatientDialogDetails.vue";

const store = usePatientsStore();
const search = ref("");
const editDialogOpen = ref(false);
const selectedPatient = ref<Patient | null>(null);

const detailsDialogOpen = ref(false);

const openDetailsDialog = (p: Patient) => {
  selectedPatient.value = p;
  detailsDialogOpen.value = true;
};
const openEditDialog = (p: Patient) => {
  selectedPatient.value = p;
  editDialogOpen.value = true;
};
const filtered = computed((): Patient[] =>
    store.patients.filter((p) => {
      const patientToSearch =
          `${p.firstName} ${p.lastName} ${p.medicalRecordNumber}`.toLowerCase();

      return patientToSearch.includes(search.value.toLowerCase());
    }),
);
const statusColor = (p: Patient) => {
  const s = store.getPatientStatus(p);
  return s === CRITICAL_STATUS
      ? "red"
      : s === WATCH_STATUS
          ? "orange"
          : "green";
};

const handleSave = async (updated: Patient) => {
  try {
    await store.updatePatient(updated);
  } catch (err) {
    console.error("Save failed:", err);
  }
};

onMounted(() => {
  store.fetchPatients();
});

useIntervalFn(() => {
  store.fetchPatients();
}, 60000);
</script>