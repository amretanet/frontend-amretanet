<script lang="ts" setup>
import MikrotikSecretList from "@/page-components/mikrotik/secret/MikrotikSecretList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-router",
    name: "Mikrotik",
  },
  {
    name: "Secret",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <MikrotikSecretList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mikrotik Secret
</route>
