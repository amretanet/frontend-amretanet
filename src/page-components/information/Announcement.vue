<script setup lang="ts">
// VARIABLES
const announcement = ref("");
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-bell-ringing" />
      </template>
      <template #title> Pengumuman </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="announcement"
        contentType="html"
        theme="snow"
        toolbar="full"
      />
    </VCardText>
  </VCard>
</template>
