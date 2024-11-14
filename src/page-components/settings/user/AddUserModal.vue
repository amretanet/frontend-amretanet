<script setup lang="ts">
import ProcessButton from "@/page-components/ProcessButton.vue";

const is_showing_modal = ref(false);
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus" class="wm-100">
          <VTooltip activator="parent"> Tambah Pengguna </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-user-plus" />
          </template>
          <template #title> Tambah Pengguna </template>
        </VCardItem>
        <VCardText>
          <VForm>
            <VRow>
              <VCol cols="12">
                <VTextField label="Nama" clearable />
              </VCol>
              <VCol cols="12">
                <VTextField label="Email" clearable />
              </VCol>
              <VCol cols="12">
                <VTextField label="No Telp/Whatsapp" clearable />
              </VCol>
              <VCol cols="12">
                <VSelect label="Level" clearable />
              </VCol>
              <VCol cols="12">
                <VTextField label="Password" clearable />
              </VCol>
              <VCol cols="12">
                <VTextField label="Konfirmasi Password" clearable />
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton :is_on_process="false"/>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
