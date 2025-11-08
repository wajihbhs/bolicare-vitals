<template>
  <v-btn
      v-bind="$attrs"
      class="text-none font-semibold"
      :block="block"
      :color="color"
      :variant="computedVariant"
      :disabled="disabled"
      :loading="loading"
      :class="{ 'text-uppercase': uppercase }"
      @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string,
  block?: boolean,
  color?: string,
  text?: boolean,
  variant?: "flat" | "outlined" | "tonal" | "elevated" | "text" | "plain",
  disabled?: boolean,
  loading?: boolean,
  uppercase?: boolean,
}>()

defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

import { computed } from "vue";

const computedVariant = computed(() => {
  if (props.text) return "text";
  return props.variant ?? undefined;
});
</script>
