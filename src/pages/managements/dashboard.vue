<script lang="ts" setup>
import LocationMapping from "@/page-components/managements/dashboard/LocationMapping.vue";
import TicketStats from "@/page-components/managements/dashboard/TicketStats.vue";
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
      <TicketStats />
    </VCol>
    <VCol cols="12">
      <LocationMapping />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Dashboard
</route>
