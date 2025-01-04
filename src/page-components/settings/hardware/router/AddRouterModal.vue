<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IEmits {
  (e: "routerAdded"): void;
}

// VARIABLE
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const is_show_password = ref(false);
const options = ref({
  status: [
    {
      title: "Aktif",
      value: 1,
    },
    {
      title: "Nonaktif",
      value: 0,
    },
  ],
});
const router_form = ref<VForm>();
const router_data = ref({
  name: "",
  ip_address: "",
  api_port: 0,
  username: "",
  password: "",
  status: 1,
});

// FUNCTION
const saveRouter = () => {
  router_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("router/add", {
          data: router_data.value,
        })
        .then(() => {
          emits("routerAdded");
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
  router_form.value?.reset();
  router_data.value.api_port = 0;
  router_data.value.status = 1;
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Router </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="450" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Tambah Router </template>
        </VCardItem>
        <VCardText>
          <VForm ref="router_form" @submit.prevent="saveRouter">
            <VRow>
              <!-- NAME -->
              <VCol cols="12">
                <VTextField
                  v-model="router_data.name"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama/Kode Router <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- IP ADDRESS -->
              <VCol cols="12">
                <VTextField
                  v-model="router_data.ip_address"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Host/IP Address <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PORT API -->
              <VCol cols="12" md="5" sm="12">
                <VTextField
                  v-model="router_data.api_port"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Port API <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- STATUS -->
              <VCol cols="12" md="7" sm="12">
                <VSelect
                  v-model="router_data.status"
                  :items="options.status"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Status <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- USERNAME -->
              <VCol cols="12">
                <VTextField
                  v-model="router_data.username"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Username <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PASSWORD -->
              <VCol cols="12">
                <VTextField
                  v-model="router_data.password"
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
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      size="default"
                      block
                      color="error"
                      @click="(is_showing_modal = false), resetForm()"
                    >
                      Batal
                    </VBtn>
                  </VCol>
                  <VCol cols="6">
                    <ProcessButton
                      :is_on_process="is_on_process"
                      size="default"
                      block
                      type="submit"
                      :disabled="is_on_process"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
