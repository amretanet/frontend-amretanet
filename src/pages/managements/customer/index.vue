<script lang="ts" setup>
import CustomerList from "@/page-components/customer/CustomerList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-user-square-rounded",
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
      <CustomerList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pelanggan
</route>
