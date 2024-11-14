<script setup lang="ts">
import { confirmAction, showToastification } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const is_on_process = ref(false);
const whatsapp_gateway_url = ref("https://wa7.amretanet.my.id/login");

// FUNCTION
const updateWhatsappbotConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi Bot Whatsapp akan disimpan",
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
        <VIcon icon="tabler-brand-whatsapp" />
      </template>
      <template #title> Bot Whatsapp </template>
      <template #append>
        <VBtn
          size="small"
          prepend-icon="tabler-brand-whatsapp"
          color="success"
          :href="whatsapp_gateway_url"
          target="_blank"
          variant="outlined"
        >
          Whatsapp Gateway
        </VBtn>
      </template>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Nomor Bot" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="Nomor Admin" />
        </VCol>
        <VCol cols="12" md="4" sm="12">
          <VTextField label="API Key Gateway" />
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VTextField label="URL Server" />
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VTextField label="URL Media" />
        </VCol>
        <VCol cols="12" md="12" sm="12">
          <VTextField label="URL Gateway" />
        </VCol>
        <VCol cols="12">
          <div class="d-flex justify-end gap-2">
            <VBtn size="small" color="warning"> Reset </VBtn>
            <ProcessButton
              :is_on_process="is_on_process"
              @click="updateWhatsappbotConfig()"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
