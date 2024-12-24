<script setup lang="ts">
import {
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { IUsers } from "@/models";
import { errorMessage, showActionResult } from "@/modules";
import { gender_options, user_role_options } from "@/modules/options";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: IUsers;
}
interface IEmits {
  (e: "userUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  gender: gender_options,
  role: user_role_options,
});
const user_form = ref<VForm>();
const user_data = ref({
  name: props.data.name,
  email: props.data.email,
  phone_number: props.data.phone_number,
  status: props.data.status,
  gender: props.data.gender,
  saldo: props.data.saldo,
  role: props.data.role,
  address: props.data.address,
});

// FUNCTION
const updateUser = () => {
  user_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`user/update/${props.data._id}`, {
          data: user_data.value,
        })
        .then(() => {
          emits("userUpdated");
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

// LIFECYCLE HOOKS
watch(props, () => {
  user_data.value.name = props.data.name;
  user_data.value.email = props.data.email;
  user_data.value.phone_number = props.data.phone_number;
  user_data.value.status = props.data.status;
  user_data.value.gender = props.data.gender;
  user_data.value.saldo = props.data.saldo;
  user_data.value.role = props.data.role;
  user_data.value.address = props.data.address;
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" prepend-icon="tabler-edit" color="info">
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Pengguna </template>
        </VCardItem>
        <VCardText>
          <VForm ref="user_form" @submit.prevent="updateUser">
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
                    Nomor Telepon <span class="text-error">*</span>
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
                <VTextarea v-model="user_data.address" label="Alamat" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
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
