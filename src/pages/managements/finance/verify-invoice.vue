<script lang="ts" setup>
import VerifyInvoiceList from "@/page-components/finance/verify-invoice/VerifyInvoiceList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-cash-register",
    name: "Keuangan",
  },
  {
    name: "Verifikasi Tagihan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <VerifyInvoiceList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Verifikasi Tagihan
</route>
