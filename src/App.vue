<script setup lang="ts">
import { useTheme } from "vuetify";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";
import { stateManagement } from "./store";

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig();
const store = stateManagement();
const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme();
syncConfigThemeWithVuetifyTheme();
</script>

<template>
  <VProgressLinear
    v-if="store.getIsLoading"
    indeterminate
    color="primary"
    height="5"
    style="position: fixed; z-index: 999"
  />
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
