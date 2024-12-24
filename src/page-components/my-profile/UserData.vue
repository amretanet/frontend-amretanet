<script setup lang="ts">
import {
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";
import ProcessButton from "../ProcessButton.vue";
import { gender_options } from "@/modules/options";

// VARIABLE
const store = stateManagement();
const is_on_process = ref(false);
const user_form = ref<VForm>();
const user_data = ref(JSON.parse(JSON.stringify(store.getUser)));
const options = ref({
  gender: gender_options,
});

// FUNCTION
const updateUser = () => {
  user_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`user/update/${user_data.value._id}`, {
          data: user_data.value,
        })
        .then(() => {
          store.userHandler(user_data.value);
          showActionResult();
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
        });
    }
  });
};
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-user-code" />
      </template>
      <template #title> Data Pengguna </template>
    </VCardItem>
    <VCardText>
      <VForm ref="user_form" @submit.prevent="updateUser">
        <VRow>
          <VCol cols="12">
            <VTextField v-model="user_data.name" :rules="[requiredValidator]">
              <template #label>
                Nama <span class="text-error">*</span>
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12" md="8" sm="12">
            <VTextField
              v-model="user_data.email"
              :rules="[requiredValidator, emailValidator]"
            >
              <template #label>
                Email <span class="text-error">*</span>
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12" md="4" sm="12">
            <VTextField
              v-model="user_data.referral"
              label="Kode Referral"
              readonly
            />
          </VCol>
          <VCol cols="12" md="7" sm="12">
            <VTextField
              v-model="user_data.phone_number"
              :rules="[requiredValidator, phoneNumberValidator]"
            >
              <template #prepend-inner> +62 </template>
              <template #label>
                Nomor Telepon <span class="text-error">*</span>
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12" md="5" sm="12">
            <VSelect
              v-model="user_data.gender"
              :items="options.gender"
              :rules="[requiredValidator]"
            >
              <template #label>
                Jenis Kelamin <span class="text-error">*</span>
              </template>
            </VSelect>
          </VCol>
          <VCol cols="12">
            <VTextarea v-model="user_data.address" rows="2">
              <template #label>
                Alamat <span class="text-error">*</span>
              </template>
            </VTextarea>
          </VCol>
          <VCol cols="12">
            <div class="d-flex gap-2 justify-end">
              <VBtn size="small" color="error">Batal</VBtn>
              <ProcessButton :is_on_process="is_on_process" type="submit" />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
