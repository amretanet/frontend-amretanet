<script lang="ts" setup>
import LocationMapping from "@/page-components/dashboard/LocationMapping.vue";
import TicketStats from "@/page-components/dashboard/TicketStats.vue";
import MikrotikSystemResource from "@/page-components/dashboard/MikrotikSystemResource.vue";
import PageHeader from "@/page-components/PageHeader.vue";
import CustomerStatusStats from "@/page-components/dashboard/CustomerStatusStats.vue";
import { stateManagement } from "@/store";
import IncomeStats from "@/page-components/dashboard/IncomeStats.vue";

// VARIABLE
const store = stateManagement();
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
    <VCol v-if="store.isAdmin" cols="12">
      <IncomeStats />
    </VCol>
    <VCol cols="12">
      <TicketStats />
    </VCol>
    <VCol cols="12">
      <CustomerStatusStats />
    </VCol>
    <VCol v-if="store.isAdmin" cols="12">
      <MikrotikSystemResource />
    </VCol>
    <VCol v-if="store.isAdmin" cols="12">
      <LocationMapping />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Dashboard
</route>
