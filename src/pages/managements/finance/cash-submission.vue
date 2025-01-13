<script lang="ts" setup>
import CashSubmissionList from "@/page-components/finance/cash-submission/CashSubmissionList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-cash-register",
    name: "Keuangan",
  },
  {
    name: "Pengajuan Kasbon",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CashSubmissionList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pengajuan Kasbon
</route>
