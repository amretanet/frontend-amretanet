<script setup lang="ts">
import About from "@/page-components/managements/information/About.vue";
import Announcement from "@/page-components/managements/information/Announcement.vue";
import Privacy from "@/page-components/managements/information/Privacy.vue";
import Rules from "@/page-components/managements/information/Rules.vue";
import PageHeader from "@/page-components/PageHeader.vue";

// VARIABLES
const path_data = ref([
  {
    icon: "tabler-info-circle",
    name: "Informasi",
  },
]);
const current_tab = ref("announcement");
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VTabs v-model="current_tab">
            <VTab value="announcement">Pengumuman</VTab>
            <VTab value="rules">Syarat & Ketentuan</VTab>
            <VTab value="privacy">Kebijakan Privasi</VTab>
            <VTab value="about">Tentang Kami</VTab>
          </VTabs>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12">
      <VWindow v-model="current_tab">
        <VWindowItem value="announcement">
          <Announcement />
        </VWindowItem>
        <VWindowItem value="rules">
          <Rules />
        </VWindowItem>
        <VWindowItem value="privacy">
          <Privacy />
        </VWindowItem>
        <VWindowItem value="about">
          <About />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Informasi
</route>
