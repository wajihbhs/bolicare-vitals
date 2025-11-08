<template>
  <base-dialog
      v-model="dialogOpen"
      :title="dialogTitle"
      :max-width="900"
  >
    <v-row>
      <v-col cols="12" md="6">
        <apexchart
            type="line"
            height="250"
            :options="chartOptions(t('charts.heart-rate'), t('charts.unit.bpm'), heartRateSeries[0].data)"
            :series="heartRateSeries"
        />
      </v-col>
      <v-col cols="12" md="6">
        <apexchart
            type="line"
            height="250"
            :options="chartOptions(t('charts.temperature'), t('charts.unit.celsius'), tempSeries[0].data)"
            :series="tempSeries"
        />
      </v-col>
      <v-col cols="12">
        <apexchart
            type="line"
            height="250"
            :options="chartOptions(t('charts.blood-pressure'), t('charts.unit.mmHg'), bpSeries[0].data)"
            :series="bpSeries"
        />
      </v-col>
    </v-row>
  </base-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type {ChartSeries, Patient} from "../../types";
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

const dialogTitle = ref("Patient Details");

watch(() => props.modelValue, (val) => (dialogOpen.value = val));
watch(() => dialogOpen.value, (val) => emit("update:modelValue", val));

/** Reactive series for ApexCharts */
const heartRateSeries = ref<ChartSeries[]>([{ name: t("form.titles.heart-rate"), data: [] }]);
const tempSeries = ref<ChartSeries[]>([{ name: t("form.titles.temperature"), data: [] }]);
const bpSeries = ref<ChartSeries[]>([
  { name: t("form.labels.systolic-x"), data: [] },
  { name: t("form.labels.diastolic-x"), data: [] },
]);

/**
 * Watch patient prop and update chart series
 * - Each vital has its own reactive chart series
 * - Automatically updates whenever the patient prop changes
 */
watch(
    () => props.patient,
    (p) => {
      if (p) {
        heartRateSeries.value = [
          { name: t("form.titles.heart-rate"), data: p.vitals.heartRate }
        ];
        tempSeries.value = [
          { name: t("form.titles.temperature"), data: p.vitals.temperature }
        ];
        bpSeries.value = [
          { name: t("form.labels.systolic-x"), data: p.vitals.bloodPressure.map(bp => bp.systolic) },
          { name: t("form.labels.diastolic-x"), data: p.vitals.bloodPressure.map(bp => bp.diastolic) },
        ];
      } else {
        // Reset chart data if nop patient selected
        heartRateSeries.value = [{ name: t("form.titles.heart-rate"), data: [] }];
        tempSeries.value = [{ name: t("form.titles.temperature"), data: [] }];
        bpSeries.value = [
          { name: t("form.labels.systolic-x"), data: [] },
          { name: t("form.labels.diastolic-x"), data: [] },
        ];
      }
    },
    { immediate: true }
);

/**
 * Generate categories for X-axis of charts
 * @param length Number of data points
 * @returns Array<string> of category labels, e.g. ["T1", "T2", ...]
 */
const generateCategories = (length: number) => {
  const categories: string[] = [];
  for (let i = 1; i <= length; i++) {
    categories.push(`T${i}`);
  }
  return categories;
};

/**
 * Generate ApexCharts options for a chart
 * @param title Chart title
 * @param yTitle Y-axis title
 * @param seriesData Data points for the chart
 * @returns ApexCharts options object
 */
const chartOptions = (title: string, yTitle: string, seriesData: number[]) => ({
  chart: { type: "line", toolbar: { show: false } },
  stroke: { curve: "smooth" },
  markers: { size: 4 },
  title: { text: title, align: "center" },
  yaxis: { title: { text: yTitle } },
  xaxis: { categories: generateCategories(seriesData.length) },
});
</script>