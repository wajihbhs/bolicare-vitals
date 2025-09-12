<template>
  <base-dialog
    v-model="visible"
    :title="dialogTitle"
    :max-width="700"
    :confirm-loading="saving"
    @confirm="handleSave"
    @cancel="handleCancel"
  >
    <v-form v-if="editedPatient">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="editedPatient.firstName"
            :label="$t('form.fields.first-name')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="editedPatient.lastName"
            :label="$t('form.fields.last-name')"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="editedPatient.age"
            type="number"
            :label="$t('form.fields.age')"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="editedPatient.medicalRecordNumber"
            :label="$t('form.fields.medical-record-number')"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="mb-4">
        <div class="text-subtitle-1 mb-2">
          {{ $t("form.titles.heart-rate") }}
        </div>
        <v-row>
          <v-col
            cols="12"
            md="3"
            v-for="(hr, idx) in editedPatient.vitals.heartRate"
            :key="`hr-${idx}`"
          >
            <v-text-field
              v-model.number="editedPatient.vitals.heartRate[idx]"
              type="number"
              :label="$t('form.labels.hr-x', { index: idx + 1 })"
            />
            <div class="d-flex justify-space-between mt-1">
              <v-btn icon small @click="removeNumberEntry('heartRate', idx)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-btn text @click="addNumberEntry('heartRate')">
              <v-icon left>mdi-plus</v-icon> {{ $t("form.buttons.add-hr") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-4" />

      <div class="mb-4">
        <div class="text-subtitle-1 mb-2">
          {{ $t("form.titles.temperature") }}
        </div>
        <v-row>
          <v-col
            cols="12"
            md="3"
            v-for="(t, idx) in editedPatient.vitals.temperature"
            :key="`t-${idx}`"
          >
            <v-text-field
              v-model.number="editedPatient.vitals.temperature[idx]"
              type="number"
              :label="$t('form.labels.temp-x', { index: idx + 1 })"
              step="0.1"
            />
            <div class="d-flex justify-space-between mt-1">
              <v-btn icon small @click="removeNumberEntry('temperature', idx)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-btn text @click="addNumberEntry('temperature')">
              <v-icon left>mdi-plus</v-icon> {{ $t("form.buttons.add-temp") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-4" />

      <div class="mb-4">
        <div class="text-subtitle-1 mb-2">
          {{ $t("form.titles.blood-pressure") }}
        </div>
        <v-row>
          <v-col
            cols="12"
            md="6"
            v-for="(bp, idx) in editedPatient.vitals.bloodPressure"
            :key="`bp-${idx}`"
          >
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="
                    editedPatient.vitals.bloodPressure[idx].systolic
                  "
                  type="number"
                  :label="$t('form.labels.systolic-x', { index: idx + 1 })"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="
                    editedPatient.vitals.bloodPressure[idx].diastolic
                  "
                  type="number"
                  :label="$t('form.labels.diastolic-x', { index: idx + 1 })"
                />
              </v-col>
            </v-row>
            <div class="d-flex justify-space-between mt-1">
              <v-btn icon small @click="removeBPEntry(idx)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-btn text @click="addBPEntry">
              <v-icon left>mdi-plus</v-icon> {{ $t("form.buttons.add-bp") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-4" />

      <div class="mb-4">
        <div class="text-subtitle-1 mb-2">
          {{ $t("form.titles.oxygen-saturation") }}
        </div>
        <v-row>
          <v-col
            cols="12"
            md="3"
            v-for="(o2, idx) in editedPatient.vitals.oxygenSaturation"
            :key="`o2-${idx}`"
          >
            <v-text-field
              v-model.number="editedPatient.vitals.oxygenSaturation[idx]"
              type="number"
              :label="$t('form.labels.spo2-x', { index: idx + 1 })"
            />
            <div class="d-flex justify-space-between mt-1">
              <v-btn
                icon
                small
                @click="removeNumberEntry('oxygenSaturation', idx)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-btn text @click="addNumberEntry('oxygenSaturation')">
              <v-icon left>mdi-plus</v-icon> {{ $t("form.buttons.add-spo2") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </base-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { Patient } from "../../types";

const props = defineProps<{
  modelValue?: boolean;
  patient?: Patient | null;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", payload: Patient): void;
}>();

const visible = ref<boolean>(props.modelValue ?? false);
watch(
    () => props.modelValue,
    (val) => (visible.value = !!val),
);
watch(visible, (val) => emit("update:modelValue", val));

const dialogTitle = props.title ?? "";
const saving = ref(false);
const editedPatient = ref<Patient | null>(null);

watch(
    () => props.patient,
    (p) => {
      if (p) {
        editedPatient.value = JSON.parse(JSON.stringify(p)) as Patient;
        if (!editedPatient.value.vitals) {
          editedPatient.value.vitals = {
            heartRate: [],
            temperature: [],
            bloodPressure: [],
            oxygenSaturation: [],
          };
        }
        editedPatient.value.vitals.heartRate ||= [];
        editedPatient.value.vitals.temperature ||= [];
        editedPatient.value.vitals.bloodPressure ||= [];
        editedPatient.value.vitals.oxygenSaturation ||= [];
      } else {
        editedPatient.value = null;
      }
    },
    { immediate: true },
);

const addNumberEntry = (
    type: "heartRate" | "temperature" | "oxygenSaturation",
) => {
  if (!editedPatient.value) return;
  editedPatient.value.vitals[type].push(0);
};
const removeNumberEntry = (
    type: "heartRate" | "temperature" | "oxygenSaturation",
    index: number,
) => {
  if (!editedPatient.value) return;
  editedPatient.value.vitals[type].splice(index, 1);
};
const addBPEntry = () => {
  if (!editedPatient.value) return;
  editedPatient.value.vitals.bloodPressure.push({ systolic: 0, diastolic: 0 });
};
const removeBPEntry = (index: number) => {
  if (!editedPatient.value) return;
  editedPatient.value.vitals.bloodPressure.splice(index, 1);
};

const handleSave = async () => {
  if (!editedPatient.value) return;
  try {
    saving.value = true;
    emit("save", editedPatient.value);
    visible.value = false;
  } finally {
    saving.value = false;
  }
};
const handleCancel = () => {
  visible.value = false;
};
</script>

