<script lang="ts" setup>
import MikrotikLogList from "@/page-components/mikrotik/log/MikrotikLogList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-router",
    name: "Mikrotik",
  },
  {
    name: "Log",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <MikrotikLogList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mikrotik Log
</route>
