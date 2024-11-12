<script setup lang="ts">
import { confirmAction, showToastification } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const email_data = ref({
  name: "Pengirim Testing",
  address: "pengirim@gmail.com",
  password: "testing123",
  protocol: "smptp",
  host: "webhost.pengirim.com",
  port: 587,
});
const is_on_process = ref(false);
const is_show_password = ref(false);

// FUNCTION
const updateEmailConfig = async () => {
  const is_confirmed = await confirmAction(
    "Simpan Perubahan?",
    "Perubahan data konfigurasi email akan disimpan",
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
  <VCard class="h-100">
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-mail" />
      </template>
      <template #title> Email </template>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12" md="7" sm="12">
          <VRow>
            <VCol cols="12">
              <VTextField v-model="email_data.name" label="Nama Pengirim" />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="email_data.address" label="Alamat Email" />
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
              <VTextField v-model="email_data.port" label="Port" />
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12">
          <div class="d-flex justify-end gap-2">
            <VBtn size="small" color="warning"> Reset </VBtn>
            <ProcessButton
              :is_on_process="is_on_process"
              @click="updateEmailConfig()"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
