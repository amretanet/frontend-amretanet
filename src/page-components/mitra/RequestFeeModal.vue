<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import { stateManagement } from "@/store";

// INTERFACE
interface IEmits {
  (e: "feeRequested"): void;
}

// VARIABLE
const store = stateManagement();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const request_fee_form = ref<VForm>();
const request_fee_data = ref({
  id_user: store.getUser._id,
  reason: null,
  nominal: 0,
});

// FUNCTION
const requestFee = () => {
  request_fee_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post(`referral-fee/request`, {
          data: request_fee_data.value,
        })
        .then(() => {
          showActionResult(
            undefined,
            undefined,
            "Penarikan Bonus Telah Diajukan!"
          );
          emits("feeRequested");
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
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Ajukan Penarikan </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Pengajuan Penarikan Bonus </template>
        </VCardItem>
        <VCardText>
          <VForm
            ref="request_fee_form"
            @submit.prevent="requestFee"
            class="mt-2"
          >
            <VRow>
              <!-- NOMINAL -->
              <VCol cols="12">
                <VTextField
                  v-model="request_fee_data.nominal"
                  type="number"
                  clearable
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Nominal Penarikan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- REASON -->
              <VCol cols="12">
                <VTextarea
                  v-model="request_fee_data.reason"
                  label="Alasan Penarikan"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      size="default"
                      color="error"
                      block
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
