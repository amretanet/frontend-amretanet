<script lang="ts" setup>
import MikrotikProfileList from "@/page-components/mikrotik/profile/MikrotikProfileList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

const path_data = ref([
  {
    icon: "tabler-router",
    name: "Mikrotik",
  },
  {
    name: "Profile",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <MikrotikProfileList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mikrotik Profile
</route>
