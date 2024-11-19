<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import APIKeysConfig from "@/page-components/settings/system-configuration/APIKeysConfig.vue";
import EmailConfig from "@/page-components/settings/system-configuration/EmailConfig.vue";
import TelebotConfig from "@/page-components/settings/system-configuration/TelebotConfig.vue";
import WhatsappBot from "@/page-components/settings/system-configuration/WhatsappBot.vue";

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
    <VCol cols="12">
      <PageHeader :data="path_data" :is_show_backup_button="true" />
    </VCol>
    <VCol cols="12" md="7" sm="12">
      <EmailConfig />
    </VCol>
    <VCol cols="12" md="5" sm="12">
      <APIKeysConfig />
    </VCol>
    <VCol cols="12">
      <TelebotConfig />
    </VCol>
    <VCol cols="12">
      <WhatsappBot />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Konfigurasi Sistem
</route>
