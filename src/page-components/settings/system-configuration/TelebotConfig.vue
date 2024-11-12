<script setup lang="ts">
import { confirmAction, showToastification } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const is_on_process = ref(false);

// FUNCTION
const updateTelebotConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi Bot Telegram akan disimpan",
    "Ya Simpan!"
  );
  if (is_confirmed) {
    is_on_process.value = true;
    setTimeout(() => {
      showToastification();
      is_on_process.value = false;
    }, 500);
  }
};
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-brand-telegram" />
      </template>
      <template #title> Bot Telegram </template>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12" md="7" sm="12">
          <VTextField label="Token Bot" />
        </VCol>
        <VCol cols="12" md="5" sm="12">
          <VTextField label="Username Bot" />
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VTextField label="Username Owner" />
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VTextField label="ID Owner" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID PSB" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID Tiket" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID Lain-lain" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID Notifikasi" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID Pembayaran" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Chat ID Webhook" />
        </VCol>
        <VCol cols="12">
          <VTextField label="Link Webhook" />
        </VCol>
        <VCol cols="12">
          <div class="d-flex justify-end gap-2">
            <VBtn size="small" color="warning"> Reset </VBtn>
            <ProcessButton
              :is_on_process="is_on_process"
              @click="updateTelebotConfig()"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
