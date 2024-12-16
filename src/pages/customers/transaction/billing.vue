<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-dashboard",
    name: "Transaksi",
  },
  {
    icon: "tabler-dashboard",
    name: "Tagihan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Tagihan
</route>
