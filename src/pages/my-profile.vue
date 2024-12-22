<script lang="ts" setup>
import ChangePassword from "@/page-components/my-profile/ChangePassword.vue";
import UserData from "@/page-components/my-profile/UserData.vue";
import PageHeader from "@/page-components/PageHeader.vue";

// VARIABLE
const router = useRouter();
const path_data = ref([
  {
    icon: "tabler-user",
    name: "Profil Saya",
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
      <UserData />
    </VCol>
    <VCol cols="12" md="5" sm="12">
      <ChangePassword />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Profil Saya
</route>
