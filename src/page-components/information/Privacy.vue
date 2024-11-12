<script setup lang="ts">
// VARIABLES
const privacy = ref("");
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-shield-check" />
      </template>
      <template #title>
        Kebijakan Privasi
      </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="privacy"
        contentType="html"
        theme="snow"
        toolbar="full"
      />
    </VCardText>
  </VCard>
</template>
