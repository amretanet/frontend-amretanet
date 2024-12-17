<script lang="ts" setup>
import CustomerStats from "@/page-components/dashboard/CustomerStats.vue";
import SpeedTest from "@/page-components/SpeedTest.vue";
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
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CustomerStats />
    </VCol>
    <VCol cols="12">
      <SpeedTest />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Dashboard
</route>
