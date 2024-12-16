<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import RouterList from "@/page-components/managements/settings/hardware/router/RouterList.vue";
import ODCList from "@/page-components/managements/settings/hardware/odc/ODCList.vue";
import ODPList from "@/page-components/managements/settings/hardware/odp/ODPList.vue";

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
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <ODCList />
    </VCol>
    <VCol cols="12">
      <ODPList />
    </VCol>
    <VCol cols="12">
      <RouterList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Perangkat
</route>
