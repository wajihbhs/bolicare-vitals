<template>
  <v-menu v-model="showDropdown" offset-y>
    <template #activator="{ props }">
      <div v-bind="props">
        <slot name="trigger" />
      </div>
    </template>

    <v-list class="pa-0">
      <slot name="content" />
    </v-list>
  </v-menu>
</template>
<script setup lang="ts">
const showDropdown = defineModel<boolean>();
</script>
