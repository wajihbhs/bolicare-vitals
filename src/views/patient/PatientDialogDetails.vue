<template>
  <v-dialog v-model="dialogOpen" max-width="900">
    <v-card>
      <v-card-title>
        {{ patient?.firstName }} {{ patient?.lastName }} -
        {{ $t("actions.details") }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <apexchart
              type="line"
              height="250"
              :options="
                chartOptions(
                  $t('charts.heart-rate'),
                  $t('charts.unit.bpm'),
                  heartRateSeries[0].data,
                )
              "
              :series="heartRateSeries"
            />
          </v-col>
          <v-col cols="12" md="6">
            <apexchart
              type="line"
              height="250"
              :options="
                chartOptions(
                  $t('charts.temperature'),
                  $t('charts.unit.celsius'),
                  tempSeries[0].data,
                )
              "
              :series="tempSeries"
            />
          </v-col>
          <v-col cols="12">
            <apexchart
              type="line"
              height="250"
              :options="
                chartOptions(
                  $t('charts.blood-pressure'),
                  $t('charts.unit.mmHg'),
                  bpSeries[0].data,
                )
              "
              :series="bpSeries"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn color="primary" variant="flat" @click="dialogOpen = false">
          {{ $t("actions.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { Patient } from "../../types";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  patient: Patient | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const dialogOpen = ref(props.modelValue);

watch(
    () => props.modelValue,
    (val) => (dialogOpen.value = val),
);
watch(
    () => dialogOpen.value,
    (val) => emit("update:modelValue", val),
);

const heartRateSeries = ref([{ name: t("form.titles.heart-rate"), data: [] }]);
const tempSeries = ref([{ name: t("form.titles.temperature"), data: [] }]);
const bpSeries = ref([
  { name: t("form.labels.systolic-x"), data: [] },
  { name: t("form.labels.diastolic-x"), data: [] },
]);

watch(
    () => props.patient,
    (p) => {
      if (p) {
        heartRateSeries.value = [
          { name: t("form.titles.heart-rate"), data: p.vitals.heartRate },
        ];
        tempSeries.value = [
          { name: t("form.titles.temperature"), data: p.vitals.temperature },
        ];
        bpSeries.value = [
          {
            name: t("form.labels.systolic-x"),
            data: p.vitals.bloodPressure.map((bp) => bp.systolic),
          },
          {
            name: t("form.labels.diastolic-x"),
            data: p.vitals.bloodPressure.map((bp) => bp.diastolic),
          },
        ];
      }
    },
    { immediate: true },
);

const generateCategories = (length: number) => {
  const cats: string[] = [];
  for (let i = 1; i <= length; i++) {
    cats.push(`T${i}`);
  }
  return cats;
};

const chartOptions = (title: string, yTitle: string, seriesData: number[]) => ({
  chart: { type: "line", toolbar: { show: false } },
  stroke: { curve: "smooth" },
  markers: { size: 4 },
  title: { text: title, align: "center" },
  yaxis: { title: { text: yTitle } },
  xaxis: { categories: generateCategories(seriesData.length) },
});
</script>
