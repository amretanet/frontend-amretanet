<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import ReferralCustomerList from "@/page-components/customer/ReferralCustomerList.vue";

const path_data = ref([
  {
    icon: "tabler-user-square-rounded",
    name: "Pelanggan Referral",
  },
]);
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data" />
    </VCol>
    <VCol cols="12">
      <ReferralCustomerList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pelanggan Referral
</route>
