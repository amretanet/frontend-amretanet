<script setup lang="ts">
import { urlValidator } from "@/@core/utils/validators";
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const is_on_process = ref(false);
const telebot_form = ref<VForm>();
const telebot_data = ref({
  bot_token: "",
  bot_username: "",
  owner_id: "",
  owner_username: "",
  url_webhook: "",
  id_other: "",
  id_psb: "",
  id_notification: "",
  id_payment: "",
  id_webhook: "",
  id_ticket: "",
});

// FUNCTION
const getTelebotConfig = () => {
  axiosIns.get("configuration?type=TELEGRAM_BOT").then((res) => {
    telebot_data.value.bot_token =
      res?.data?.configuration_data?.bot_token || "";
    telebot_data.value.bot_username =
      res?.data?.configuration_data?.bot_username || "";
    telebot_data.value.owner_id = res?.data?.configuration_data?.owner_id || "";
    telebot_data.value.owner_username =
      res?.data?.configuration_data?.owner_username || "";
    telebot_data.value.url_webhook =
      res?.data?.configuration_data?.url_webhook || "";
    telebot_data.value.id_other = res?.data?.configuration_data?.id_other || "";
    telebot_data.value.id_psb = res?.data?.configuration_data?.id_psb || "";
    telebot_data.value.id_notification =
      res?.data?.configuration_data?.id_notification || "";
    telebot_data.value.id_payment =
      res?.data?.configuration_data?.id_payment || "";
    telebot_data.value.id_webhook =
      res?.data?.configuration_data?.id_webhook || "";
    telebot_data.value.id_ticket =
      res?.data?.configuration_data?.id_ticket || "";
  });
};
const updateTelebotConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi Bot Telegram akan disimpan",
    "Ya Simpan!"
  );
  if (is_confirmed) {
    is_on_process.value = true;
    axiosIns
      .put("configuration/telegram-bot/update", {
        data: telebot_data.value,
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
  getTelebotConfig();
});
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
      <VForm ref="telebot_form" @submit.prevent="updateTelebotConfig()">
        <VRow>
          <VCol cols="12" md="8" sm="12">
            <VTextField v-model="telebot_data.bot_token" label="Token Bot" />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.bot_username"
              label="Username Bot"
            />
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VTextField
              v-model="telebot_data.owner_username"
              label="Username Owner"
            />
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VTextField
              v-model="telebot_data.owner_id"
              label="ID Owner"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_psb"
              label="Chat ID PSB"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_ticket"
              label="Chat ID Tiket"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_other"
              label="Chat ID Lain-lain"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_notification"
              label="Chat ID Notifikasi"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_payment"
              label="Chat ID Pembayaran"
              type="number"
            />
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="telebot_data.id_webhook"
              label="Chat ID Webhook"
              type="number"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="telebot_data.url_webhook"
              label="Link Webhook"
              :rules="[urlValidator]"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end gap-2">
              <VBtn size="small" color="warning" @click="getTelebotConfig()">
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
