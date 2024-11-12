<script setup lang="ts">
import { confirmAction, showToastification } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const api_keys_data = ref({
  google_maps_api: "67HASMasdhZfGXTjrqa8KHAS6XiOXre7ulOLx1",
  acs_api: "c",
  updated_at: new Date(),
});
const is_on_process = ref(false);

// FUNCTION
const updateAPIKeysConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi API Keys akan disimpan",
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
        <VIcon icon="tabler-key" />
      </template>
      <template #title> API Keys </template>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="api_keys_data.google_maps_api"
            label="Google Maps API"
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="api_keys_data.acs_api" label="API ACS" />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="api_keys_data.updated_at"
            readonly
            label="Terakhir Diperbarui"
          />
        </VCol>
        <VCol cols="12">
          <div class="d-flex justify-end gap-2">
            <VBtn size="small" color="warning"> Reset </VBtn>
            <ProcessButton
              :is_on_process="is_on_process"
              @click="updateAPIKeysConfig()"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
