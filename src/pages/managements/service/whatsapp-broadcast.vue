<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import UserList from "@/page-components/settings/user/UserList.vue";

const path_data = ref([
  {
    icon: "tabler-adjustments-horizontal",
    name: "Layanan",
  },
  {
    name: "Whatsapp Broadcast",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <UserList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Whatsapp Broadcast
</route>
