<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-dashboard",
    name: "Dashboard",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data" />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Dashboard
</route>
