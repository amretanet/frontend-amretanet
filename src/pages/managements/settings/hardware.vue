<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import ODCList from "@/page-components/settings/hardware/ODCList.vue";
import ODPList from "@/page-components/settings/hardware/ODPList.vue";

const path_data = ref([
  {
    icon: "tabler-settings-cog",
    name: "Pengaturan",
  },
  {
    name: "Perangkat",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <ODCList />
    </VCol>
    <VCol cols="12">
      <ODPList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Perangkat
</route>
