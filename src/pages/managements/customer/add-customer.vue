<script lang="ts" setup>
import AddCustomerForm from "@/page-components/customer/AddCustomerForm.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-user-square-rounded",
    name: "Pelanggan",
  },
  {
    name: "Tambah Pelanggan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <AddCustomerForm />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Tambah Pelanggan
</route>
