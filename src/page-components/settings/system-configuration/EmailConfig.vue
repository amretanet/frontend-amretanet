<script setup lang="ts">
import { emailValidator, integerValidator } from "@/@core/utils/validators";
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const email_form = ref<VForm>;
const email_data = ref({
  name: "",
  email: "",
  password: "",
  protocol: "",
  host: "",
  port: null,
});
const is_on_process = ref(false);
const is_show_password = ref(false);

// FUNCTION
const getEmailConfig = () => {
  axiosIns.get("configuration?type=EMAIL_BOT").then((res) => {
    email_data.value.name = res?.data?.configuration_data?.name || "";
    email_data.value.email = res?.data?.configuration_data?.email || "";
    email_data.value.password = res?.data?.configuration_data?.password || "";
    email_data.value.protocol = res?.data?.configuration_data?.protocol || "";
    email_data.value.host = res?.data?.configuration_data?.host || "";
    email_data.value.port = res?.data?.configuration_data?.port || null;
  });
};
const updateEmailConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi email akan disimpan",
    "Ya Simpan!"
  );
  if (is_confirmed) {
    is_on_process.value = true;
    axiosIns
      .put("configuration/email-bot/update", {
        data: email_data.value,
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

// FUNCTION
onMounted(() => {
  getEmailConfig();
});
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-mail" />
      </template>
      <template #title> Email </template>
    </VCardItem>
    <VCardText>
      <VForm ref="email_form" @submit.prevent="updateEmailConfig()">
        <VRow>
          <VCol cols="12" md="7" sm="12">
            <VRow>
              <VCol cols="12">
                <VTextField v-model="email_data.name" label="Nama Pengirim" />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="email_data.email"
                  label="Alamat Email"
                  :rules="[emailValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="email_data.password"
                  label="Password"
                  :type="is_show_password ? 'text' : 'password'"
                  :append-inner-icon="
                    is_show_password ? 'tabler-eye-closed' : 'tabler-eye'
                  "
                  @click:append-inner="is_show_password = !is_show_password"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="5" sm="12">
            <VRow>
              <VCol cols="12">
                <VTextField v-model="email_data.protocol" label="Protocol" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="email_data.host" label="Host" />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="email_data.port"
                  label="Port"
                  type="number"
                  :rules="[integerValidator]"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end gap-2">
              <VBtn size="small" color="warning" @click="getEmailConfig()">
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
