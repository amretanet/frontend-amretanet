<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import TicketList from "@/page-components/service/ticket/TicketList.vue";

const path_data = ref([
  {
    icon: "tabler-file-invoice",
    name: "Layanan",
  },
  {
    name: "Tiket Pengaduan",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <TicketList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Tagihan
</route>
