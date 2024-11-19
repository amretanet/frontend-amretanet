<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import UserList from "@/page-components/settings/user/UserList.vue";

const path_data = ref([
  {
    icon: "tabler-settings-cog",
    name: "Pengaturan",
  },
  {
    name: "Pengguna",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <UserList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pengguna
</route>
