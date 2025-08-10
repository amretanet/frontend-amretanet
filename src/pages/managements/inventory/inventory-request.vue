<script lang="ts" setup>
import InventoryRequestList from "@/page-components/inventory/inventory-request/InventoryRequestList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

// VARIABLE
const path_data = ref([
  {
    icon: "tabler-folder-open",
    name: "Inventory",
  },
  {
    name: "Pengajuan Barang",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <InventoryRequestList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pengajuan Barang
</route>
