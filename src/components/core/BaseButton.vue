<template>
  <v-btn
    v-bind="$attrs"
    :block="block"
    :color="color"
    :variant="variant"
    class="text-none"
    @click="emit('click')"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  block?: boolean;
  color?: string;
  variant?: "flat" | "outlined" | "tonal" | "elevated" | "text" | "plain";
}>();

const emit = defineEmits(["click"]);
</script>
