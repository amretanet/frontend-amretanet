<script lang="ts" setup>
import InventoryList from "@/page-components/inventory/inventory/InventoryList.vue";
import PageHeader from "@/page-components/PageHeader.vue";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const current_tab = ref(store.isEngineer ? "ENGINEER" : "WAREHOUSE");
const path_data = ref([
  {
    icon: "tabler-folder-open",
    name: "Inventory",
  },
  {
    name: "Barang",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VTabs v-if="store.isOwnerAdmin" v-model="current_tab">
            <VTab value="WAREHOUSE"> GUDANG </VTab>
            <VTab value="ENGINEER"> TEKNISI </VTab>
            <VTab value="CUSTOMER"> PELANGGAN </VTab>
          </VTabs>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12">
      <InventoryList v-if="current_tab == 'WAREHOUSE'" position="WAREHOUSE" />
      <InventoryList v-if="current_tab == 'ENGINEER'" position="ENGINEER" />
      <InventoryList v-if="current_tab == 'CUSTOMER'" position="CUSTOMER" />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Barang
</route>
