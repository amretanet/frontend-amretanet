<script setup lang="ts">
import {
  confirmedValidator,
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import { gender_options, user_role_options } from "@/modules/options";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IEmits {
  (e: "userAdded"): void;
}

// VARIABLE
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const is_show_password = ref(false);
const is_show_confirm_password = ref(false);
const options = ref({
  gender: gender_options,
  role: user_role_options,
});
const user_form = ref<VForm>();
const user_data = ref({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_number: "",
  status: 1,
  gender: null,
  saldo: 0,
  role: null,
  address: "",
});

// FUNCTION
const saveUser = () => {
  user_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("user/add", {
          data: user_data.value,
        })
        .then(() => {
          emits("userAdded");
          resetForm();
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
          is_showing_modal.value = false;
        });
    }
  });
};
const resetForm = () => {
  user_form.value?.reset();
  user_data.value.saldo = 0;
  user_data.value.status = 1;
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
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
          <VForm ref="user_form" @submit.prevent="saveUser">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="user_data.name"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Lengkap <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="user_data.email"
                  clearable
                  :rules="[requiredValidator, emailValidator]"
                >
                  <template #label>
                    Email <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="user_data.phone_number"
                  clearable
                  :rules="[requiredValidator, phoneNumberValidator]"
                >
                  <template #prepend-inner> +62 </template>
                  <template #label>
                    No. Telp/Whatsapp <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VSelect
                  v-model="user_data.gender"
                  :items="options.gender"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Jenis Kelamin <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="user_data.saldo" type="number" clearable>
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Jumlah Saldo <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="user_data.role"
                  :items="options.role"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Level <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="user_data.password"
                  :type="is_show_password ? 'text' : 'password'"
                  clearable
                  :append-inner-icon="
                    is_show_password ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[requiredValidator]"
                  @click:append-inner="is_show_password = !is_show_password"
                >
                  <template #label>
                    Password <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="user_data.confirm_password"
                  :type="is_show_confirm_password ? 'text' : 'password'"
                  clearable
                  :append-inner-icon="
                    is_show_confirm_password ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[
                    requiredValidator,
                    confirmedValidator(
                      user_data.confirm_password,
                      user_data.password
                    ),
                  ]"
                  @click:append-inner="
                    is_show_confirm_password = !is_show_confirm_password
                  "
                >
                  <template #label>
                    Konfirmasi Password <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VTextarea v-model="user_data.address" label="Alamat" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="(is_showing_modal = false), resetForm()"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton
                    :is_on_process="is_on_process"
                    type="submit"
                    :disabled="is_on_process"
                  />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
