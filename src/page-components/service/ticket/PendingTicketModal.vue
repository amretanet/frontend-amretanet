<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import {
  errorMessage,
  getLocation,
  showActionResult,
  uploadImageFile,
} from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "ticketPending"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const ticket_form = ref<VForm>();
const ticket_data = ref({
  name: props?.data?.name || null,
  pending_image: [] as File[],
  confirm_message: null,
});

// FUNCTION
const validateTicketForm = async () => {
  ticket_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      pendingTicket();
    }
  });
};
const pendingTicket = async () => {
  is_on_process.value = true;
  let params = {
    evidence: {
      pending_image_url: null,
    },
    confirm_message: ticket_data.value.confirm_message,
  };
  if (ticket_data.value.pending_image.length > 0) {
    const pending_image_url = await uploadImageFile(
      ticket_data.value.pending_image[0],
      "ticket_attachment"
    );
    params.evidence.pending_image_url = pending_image_url;
  }
  axiosIns
    .put(`ticket/pending/${props.data._id}`, {
      data: params,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Tiket Telah Dipending!");
      emits("ticketPending");
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(true, "error", message);
    })
    .finally(() => {
      is_on_process.value = false;
      is_showing_modal.value = false;
    });
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn
          color="secondary"
          size="35"
          prepend-icon="tabler-circle-half-vertical"
        >
          <VTooltip activator="parent"> Pending Tiket </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-circle-half-vertical" />
          </template>
          <template #title>
            Pending Tiket ({{ ticket_data?.name || "-" }})
          </template>
        </VCardItem>
        <VCardText>
          <VForm ref="ticket_form" @submit.prevent="validateTicketForm">
            <VRow>
              <!-- CONFIRM MESSAGE -->
              <VCol cols="12">
                <VTextarea
                  v-model="ticket_data.confirm_message"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Keterangan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <!-- OTHER IMAGE -->
              <VCol cols="12">
                <VFileInput
                  v-model="ticket_data.pending_image"
                  accept="image/*"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Foto Bukti <span class="text-error">*</span>
                  </template>
                </VFileInput>
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
