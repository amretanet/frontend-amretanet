<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import CoverageAreaList from "@/page-components/managements/settings/coverage-area/CoverageAreaList.vue";

const path_data = ref([
  {
    icon: "tabler-settings-cog",
    name: "Pengaturan",
  },
  {
    name: "Cakupan Area",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CoverageAreaList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Cakupan Area
</route>
