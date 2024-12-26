<script lang="ts" setup>
import SalaryList from "@/page-components/finance/salary/SalaryList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-cash-register",
    name: "Keuangan",
  },
  {
    name: "Gaji Karyawan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <SalaryList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Gaji Karyawan
</route>
