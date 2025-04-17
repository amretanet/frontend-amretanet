<script lang="ts" setup>
import CustomerList from "@/page-components/customer/CustomerList.vue";
import PageHeader from "@/page-components/PageHeader.vue";

// VARIABLE
const router = useRouter();
const routes = useRoute();
const path_data = ref([
  {
    icon: "tabler-user-square-rounded",
    name: "Pelanggan",
  },
]);

// FUNCTION
const backToPrev = () => {
  router.back();
};
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VBtn
            v-if="routes?.query?.is_back_button"
            variant="text"
            prepend-icon="tabler-arrow-left"
            @click="backToPrev()"
          >
            Kembali
          </VBtn>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12">
      <CustomerList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pelanggan
</route>
