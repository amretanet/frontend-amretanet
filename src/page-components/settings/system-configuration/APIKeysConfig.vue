<script setup lang="ts">
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const api_keys_form = ref<VForm>();
const api_keys_data = ref({
  maps_api: "67HASMasdhZfGXTjrqa8KHAS6XiOXre7ulOLx1",
  acs_api: "c",
  updated_at: "",
});
const is_on_process = ref(false);

// FUNCTION
const getAPIKeysConfig = () => {
  axiosIns.get("configuration?type=GOOGLE_MAPS_API").then((res) => {
    api_keys_data.value.maps_api =
      res?.data?.configuration_data?.maps_api || "";
    api_keys_data.value.acs_api = res?.data?.configuration_data?.acs_api || "";
    api_keys_data.value.updated_at =
      res?.data?.configuration_data?.updated_at || "";
  });
};
const updateAPIKeysConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi API Keys akan disimpan",
    "Ya Simpan!"
  );
  if (is_confirmed) {
    is_on_process.value = true;
    axiosIns
      .put("configuration/maps-api/update", {
        data: api_keys_data.value,
      })
      .then(() => {
        showActionResult();
        getAPIKeysConfig();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        is_on_process.value = false;
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getAPIKeysConfig();
});
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-key" />
      </template>
      <template #title> API Keys </template>
    </VCardItem>
    <VCardText>
      <VForm ref="api_keys_form" @submit.prevent="updateAPIKeysConfig()">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="api_keys_data.maps_api"
              label="Google Maps API"
            />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="api_keys_data.acs_api" label="API ACS" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end gap-2">
              <VBtn size="small" color="warning" @click="getAPIKeysConfig()">
                Reset
              </VBtn>
              <ProcessButton :is_on_process="is_on_process" type="submit" />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
