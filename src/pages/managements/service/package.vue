<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import PackageList from "@/page-components/service/package/PackageList.vue";

const path_data = ref([
  {
    icon: "tabler-adjustments-horizontal",
    name: "Layanan",
  },
  {
    name: "Paket",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <PackageList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Paket
</route>
