<script lang="ts" setup>
import EditCustomerForm from "@/page-components/managements/customer/EditCustomerForm.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-user-square-rounded",
    name: "Pelanggan",
  },
  {
    name: "Edit Pelanggan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <EditCustomerForm />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Edit Pelanggan
</route>
