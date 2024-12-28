<script lang="ts" setup>
import MikrotikInterfaceList from "@/page-components/mikrotik/interface/MikrotikInterfaceList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-router",
    name: "Mikrotik",
  },
  {
    name: "Interface",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <MikrotikInterfaceList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mikrotik Interface
</route>
