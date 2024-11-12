<script setup lang="ts">
const is_showing_modal = ref(false);
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" variant="tonal" color="purple">
          <VTooltip activator="parent" location="bottom">
            Tambah Facebook Fanpage
          </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="600">
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-user-shield" />
          </template>
          <template #title> Syarat & Privasi </template>
        </VCardItem>
        <VCardText> asdasd </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
