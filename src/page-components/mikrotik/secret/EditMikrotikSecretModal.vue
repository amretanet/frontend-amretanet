<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "secretUpdated"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const secret_form = ref<VForm>();
const secret_data = ref({
  name: props?.data?.name || null,
  password: props?.data?.password || null,
  comment: props?.data?.comment || null,
});

// FUNCTION
const updateSecret = () => {
  secret_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`mikrotik/secret/update/${props.data[".id"]}`, {
          data: { router: store.getCurrentRouter, ...secret_data.value },
        })
        .then(() => {
          showActionResult(undefined, undefined, "Secret Telah Diubah!");
          emits("secretUpdated");
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
const deleteSpace = () => {
  secret_data.value.name = secret_data.value.name.replace(" ", "");
  secret_data.value.password = secret_data.value.password.replace(" ", "");
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    secret_data.value = {
      name: props?.data?.name || null,
      password: props?.data?.password || null,
      comment: props?.data?.comment || null,
    };
  }
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
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Secret </template>
        </VCardItem>
        <VCardText>
          <VForm ref="secret_form" @submit.prevent="updateSecret">
            <VRow>
              <!-- USERNAME -->
              <VCol cols="12" sm="12">
                <VTextField
                  v-model="secret_data.name"
                  :rules="[requiredValidator]"
                  @update:model-value="deleteSpace()"
                >
                  <template #label>
                    Username <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PASSWORD -->
              <VCol cols="12" sm="12">
                <VTextField
                  v-model="secret_data.password"
                  :rules="[requiredValidator]"
                  @update:model-value="deleteSpace()"
                >
                  <template #label>
                    Password <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- COMMENT -->
              <VCol cols="12" sm="12">
                <VTextField v-model="secret_data.comment">
                  <template #label> Komentar </template>
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
