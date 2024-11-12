<script setup lang="ts">
// VARIABLES
const about_us = ref("");
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-certificate" />
      </template>
      <template #title> Tentang Kami </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="about_us"
        contentType="html"
        theme="snow"
        toolbar="full"
      />
    </VCardText>
  </VCard>
</template>
