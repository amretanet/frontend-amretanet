<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import CompanyProfileForm from "@/page-components/settings/company-profile/CompanyProfileForm.vue";

const path_data = ref([
  {
    icon: "tabler-settings-cog",
    name: "Pengaturan",
  },
  {
    name: "Profil Perusahaan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CompanyProfileForm />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Profil Perusahaan
</route>
