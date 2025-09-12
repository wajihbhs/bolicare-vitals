<template>
  <v-dialog v-model="internalValue" :max-width="props.maxWidth || 600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">{{ props.title }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-center">
        <v-btn color="grey" variant="flat" @click="close">{{
          $t("actions.cancel")
        }}</v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">{{
          $t("actions.save")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  title?: string;
  maxWidth?: string | number;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const internalValue = ref(props.modelValue);

watch(
    () => props.modelValue,
    (val) => {
      internalValue.value = val;
    },
);

watch(internalValue, (val) => {
  emit("update:modelValue", val);
});

const close = () => {
  internalValue.value = false;
  emit("cancel");
};

const confirm = () => {
  emit("confirm");
  internalValue.value = false;
};
</script>