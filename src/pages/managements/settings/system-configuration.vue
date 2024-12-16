<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import GoogleMapsConfig from "@/page-components/managements/settings/system-configuration/GoogleMapsConfig.vue";
import EmailConfig from "@/page-components/managements/settings/system-configuration/EmailConfig.vue";
import TelebotConfig from "@/page-components/managements/settings/system-configuration/TelebotConfig.vue";
import WhatsappBotConfig from "@/page-components/managements/settings/system-configuration/WhatsappBotConfig.vue";

const path_data = ref([
  {
    icon: "tabler-settings-cog",
    name: "Pengaturan",
  },
  {
    name: "Konfigurasi Sistem",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" :is_show_backup_button="true" />
    </VCol>
    <VCol cols="12" md="7" sm="12">
      <EmailConfig />
    </VCol>
    <VCol cols="12" md="5" sm="12">
      <GoogleMapsConfig />
    </VCol>
    <VCol cols="12" md="5" sm="12">
      <WhatsappBotConfig />
    </VCol>
    <VCol cols="12" md="7" sm="12">
      <TelebotConfig />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Konfigurasi Sistem
</route>
