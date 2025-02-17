<script lang="ts" setup>
import FAQ from "@/page-components/help-center/FAQ.vue";
import RefundPolicy from "@/page-components/help-center/RefundPolicy.vue";
import PageHeader from "@/page-components/PageHeader.vue";

// VARIABLE
const router = useRouter();
const path_data = ref([
  {
    icon: "tabler-help",
    name: "Pusat Bantuan",
  },
]);

// FUNCTION
const backToPrev = () => {
  router.back();
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VBtn
            variant="text"
            prepend-icon="tabler-arrow-left"
            @click="backToPrev()"
          >
            Kembali
          </VBtn>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12" md="7" sm="12">
      <FAQ />
    </VCol>
    <VCol cols="12" md="5" sm="12">
      <RefundPolicy />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pusat Bantuan
</route>
