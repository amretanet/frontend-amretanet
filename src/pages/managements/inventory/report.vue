<script lang="ts" setup>
import InventoryReportList from "@/page-components/inventory/report/InventoryReportList.vue";
import PageHeader from "@/page-components/PageHeader.vue";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const path_data = ref([
  {
    icon: "tabler-folder-open",
    name: "Inventory",
  },
  {
    name: "Laporan Transaksi Barang",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <InventoryReportList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Laporan Transaksi Barang
</route>
