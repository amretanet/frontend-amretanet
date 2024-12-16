<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import UserList from "@/page-components/managements/settings/user/UserList.vue";

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
  title: Pengguna
</route>
