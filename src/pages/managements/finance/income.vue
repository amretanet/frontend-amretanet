<script lang="ts" setup>
import IncomeList from "@/page-components/finance/income/IncomeList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-coins",
    name: "Keuangan",
  },
  {
    name: "Pemasukan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <IncomeList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pemasukan
</route>
