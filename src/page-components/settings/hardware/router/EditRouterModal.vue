<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "routerUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
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
  name: props.data.name || "",
  ip_address: props.data.ip_address || "",
  api_port: props.data.api_port || 0,
  username: props.data.username || "",
  password: props.data.password || "",
  service_number_prefix: props.data.service_number_prefix || 0,
  status: props.data.status || 1,
});

// FUNCTION
const updateRouter = () => {
  router_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`router/update/${props.data._id}`, {
          data: router_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Router Telah Diubah!");
          emits("routerUpdated");
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
  router_data.value.name = props.data.name || "";
  router_data.value.ip_address = props.data.ip_address || "";
  router_data.value.api_port = props.data.api_port || 0;
  router_data.value.username = props.data.username || "";
  router_data.value.password = props.data.password || "";
  router_data.value.status = props.data.status || 1;
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="info" prepend-icon="tabler-edit">
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="450" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Router </template>
        </VCardItem>
        <VCardText>
          <VForm ref="router_form" @submit.prevent="updateRouter">
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
              <!-- SERVICE NUMBER PREFIX -->
              <VCol cols="12">
                <VTextField
                  v-model="router_data.service_number_prefix"
                  clearable
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Prefiks Nomor Layanan <span class="text-error">*</span>
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
                      @click="is_showing_modal = false"
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
