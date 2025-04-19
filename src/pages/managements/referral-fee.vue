<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import MitraList from "@/page-components/mitra/MitraList.vue";
import RequestFeeList from "@/page-components/mitra/RequestFeeList.vue";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const path_data = ref([
  {
    icon: "tabler-wallet",
    name: "Bonus Referral",
  },
]);
const current_tab = ref("mitra-list");
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <RequestFeeList :current_tab="current_tab" />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mitra
</route>
