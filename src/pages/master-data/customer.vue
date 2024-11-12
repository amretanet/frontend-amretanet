<script lang="ts" setup>
import CustomerList from "@/page-components/master-data/customer/CustomerList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-server-cog",
    name: "Master Data",
  },
  {
    name: "Pelanggan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CustomerList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pelanggan
</route>
