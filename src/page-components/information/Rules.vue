<script setup lang="ts">
// VARIABLES
const rules = ref("");
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-vocabulary" />
      </template>
      <template #title> Syarat & Ketentuan </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="rules"
        contentType="html"
        theme="snow"
        toolbar="full"
      />
    </VCardText>
  </VCard>
</template>
