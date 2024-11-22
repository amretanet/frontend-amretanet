<script setup lang="ts">
import { phoneNumberValidator, urlValidator } from "@/@core/utils/validators";
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const is_on_process = ref(false);
const whatsapp_bot_form = ref<VForm>();
const whatsapp_bot_data = ref({
  bot_number: "",
  admin_number: "",
  url_gateway: "",
  api_key: "",
});

// FUNCTION
const getWhatsappbotConfig = () => {
  axiosIns.get("configuration?type=WHATSAPP_BOT").then((res) => {
    whatsapp_bot_data.value.bot_number =
      res?.data?.configuration_data?.bot_number || "";
    whatsapp_bot_data.value.admin_number =
      res?.data?.configuration_data?.admin_number || "";
    whatsapp_bot_data.value.url_gateway =
      res?.data?.configuration_data?.url_gateway || "";
    whatsapp_bot_data.value.api_key =
      res?.data?.configuration_data?.api_key || "";
  });
};
const updateWhatsappbotConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi Bot Whatsapp akan disimpan",
    "Ya Simpan!"
  );
  if (is_confirmed) {
    is_on_process.value = true;
    axiosIns
      .put("configuration/whatsapp-bot/update", {
        data: whatsapp_bot_data.value,
      })
      .then(() => {
        showActionResult();
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
  getWhatsappbotConfig();
});
</script>

<template>
  <VCard class="h-100">
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
          :href="whatsapp_bot_data.url_gateway"
          target="_blank"
          variant="outlined"
        >
          Whatsapp Gateway
        </VBtn>
      </template>
    </VCardItem>
    <VCardText>
      <VForm
        ref="whatsapp_bot_form"
        @submit.prevent="updateWhatsappbotConfig()"
      >
        <VRow>
          <VCol cols="12" md="6" sm="12">
            <VTextField
              v-model="whatsapp_bot_data.bot_number"
              label="Nomor Bot"
              :rules="[phoneNumberValidator]"
            >
              <template #prepend-inner> +62 </template>
            </VTextField>
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VTextField
              v-model="whatsapp_bot_data.admin_number"
              label="Nomor Admin"
              :rules="[phoneNumberValidator]"
            >
              <template #prepend-inner> +62 </template>
            </VTextField>
          </VCol>
          <VCol cols="12" md="12" sm="12">
            <VTextField
              v-model="whatsapp_bot_data.api_key"
              label="API Key Gateway"
            />
          </VCol>
          <VCol cols="12" md="12" sm="12">
            <VTextField
              v-model="whatsapp_bot_data.url_gateway"
              label="URL Gateway"
              :rules="[urlValidator]"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end gap-2">
              <VBtn
                size="small"
                color="warning"
                @click="getWhatsappbotConfig()"
              >
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
