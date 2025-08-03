<script lang="ts" setup>
import BillCollectorList from "@/page-components/finance/bill-collector/BillCollectorList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-user-share",
    name: "Bill Collector",
  },
  {
    name: "Pelanggan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <BillCollectorList />
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  title: Bill Collector
</route>
