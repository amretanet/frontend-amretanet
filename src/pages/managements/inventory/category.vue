<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import CategoryList from "@/page-components/inventory/category/CategoryList.vue";

// VARIABLE
const path_data = ref([
  {
    icon: "tabler-folder-open",
    name: "Inventory",
  },
  {
    name: "Kategori",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <CategoryList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Kategori
</route>
