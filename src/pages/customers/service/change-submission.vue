<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import ChangeSubmissionList from "@/page-components/service/change-submission/ChangeSubmissionList.vue";

const path_data = ref([
  {
    icon: "tabler-adjustments-horizontal",
    name: "Layanan",
  },
  {
    name: "Pengajuan Perubahan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <ChangeSubmissionList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pengajuan Perubahan
</route>
