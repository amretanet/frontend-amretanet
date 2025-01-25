<script lang="ts" setup>
import CashflowList from "@/page-components/finance/cashflow/CashflowList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-cash-register",
    name: "Keuangan",
  },
  {
    name: "Rekapitulasi",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CashflowList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Rekapitulasi
</route>
