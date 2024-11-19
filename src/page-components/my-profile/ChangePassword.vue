<script setup lang="ts">
import {
  confirmedValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";
import ProcessButton from "../ProcessButton.vue";

// VARIABLE
const store = stateManagement();
const is_on_process = ref(false);
const is_show_old_password = ref(false);
const is_show_new_password = ref(false);
const is_show_confirm_new_password = ref(false);
const change_password_form = ref<VForm>();
const change_password_data = ref({
  old_password: "",
  new_password: "",
  confirm_new_password: "",
});

// FUNCTION
const changePassword = () => {
  change_password_form.value?.validate().then(() => {
    is_on_process.value = true;
    axiosIns
      .put(`user/change-password/${store.getUser._id}`, {
        data: change_password_data.value,
      })
      .then(() => {
        showActionResult();
        change_password_form.value?.reset();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        is_on_process.value = false;
      });
  });
};
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-key" />
      </template>
      <template #title> Ubah Password </template>
    </VCardItem>
    <VCardText>
      <VForm ref="change_password_form" @submit.prevent="changePassword">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="change_password_data.old_password"
              :type="is_show_old_password ? 'text' : 'password'"
              :rules="[requiredValidator]"
              :append-inner-icon="
                is_show_old_password ? 'tabler-eye-off' : 'tabler-eye'
              "
              @click:append-inner="is_show_old_password = !is_show_old_password"
            >
              <template #label>
                Password Lama <span class="text-error">*</span>
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="change_password_data.new_password"
              :type="is_show_new_password ? 'text' : 'password'"
              :rules="[requiredValidator]"
              :append-inner-icon="
                is_show_new_password ? 'tabler-eye-off' : 'tabler-eye'
              "
              @click:append-inner="is_show_new_password = !is_show_new_password"
            >
              <template #label>
                Password Baru <span class="text-error">*</span>
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="change_password_data.confirm_new_password"
              :type="is_show_confirm_new_password ? 'text' : 'password'"
              :rules="[
                requiredValidator,
                confirmedValidator(
                  change_password_data.confirm_new_password,
                  change_password_data.new_password
                ),
              ]"
              :append-inner-icon="
                is_show_confirm_new_password ? 'tabler-eye-off' : 'tabler-eye'
              "
              @click:append-inner="
                is_show_confirm_new_password = !is_show_confirm_new_password
              "
            >
              <template #label>
                Konfirmasi Password Baru <span class="text-error">*</span>
              </template>
            </VTextField>
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
