<template>
  <v-app-bar flat color="white" elevation="2" height="64">
    <v-container fluid class="d-flex justify-space-between">
      <v-img
        :src="Logo"
        alt="Vita Care Logo"
        max-width="80"
        max-height="60"
        contain
      />
      <base-dropdown v-model="showDropdown">
        <template #trigger>
          <base-button
            variant="flat"
            color="primary lighten-3"
            class="text-body-1 mt-2"
          >
            {{
              locale === "en"
                ? `🇬🇧 ${t("languages.en")}`
                : `🇫🇷 ${t("languages.fr")}`
            }}
          </base-button>
        </template>
        <template #content>
          <base-button
            block
            variant="flat"
            color="transparent"
            class="text-start text-dark"
            @click="changeLanguage('en')"
          >
            🇬🇧 {{ t("languages.en") }}
          </base-button>
          <base-button
            block
            variant="flat"
            color="transparent"
            class="text-start text-dark"
            @click="changeLanguage('fr')"
          >
            🇫🇷 {{ t("languages.fr") }}
          </base-button>
        </template>
      </base-dropdown>
    </v-container>
  </v-app-bar>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Logo from "../assets/logo.png";

const { t, locale } = useI18n();
const showDropdown = ref(false);

const changeLanguage = (lang: string) => {
  locale.value = lang;
  showDropdown.value = false;
};
</script>