<script lang="ts" setup>
import InvoiceList from "@/page-components/finance/invoice/InvoiceList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-coins",
    name: "Keuangan",
  },
  {
    name: "Pengeluaran",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <InvoiceList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pengeluaran
</route>
