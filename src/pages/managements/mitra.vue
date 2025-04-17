<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import MitraList from "@/page-components/mitra/MitraList.vue";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const path_data = ref([
  {
    icon: "mdi-handshake",
    name: "Mitra",
  },
]);
const current_tab = ref("mitra-list");
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VTabs v-model="current_tab">
            <VTab value="mitra-list">Daftar Mitra</VTab>
            <VTab value="fee-request">Pengajuan Bonus</VTab>
          </VTabs>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12">
      <VWindow v-model="current_tab">
        <VWindowItem value="mitra-list">
          <MitraList />
        </VWindowItem>
        <VWindowItem value="message-scheduler"> masuk </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Mitra
</route>
