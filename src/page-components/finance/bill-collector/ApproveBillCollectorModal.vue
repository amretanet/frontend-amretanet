<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import {
  dateFormatterID,
  showActionResult,
  thousandSeparator
} from "@/modules";
import { payment_method_options } from "@/modules/options";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "billCollected"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const options = ref({
  payment_method: payment_method_options,
});
const is_showing_modal = ref(false);
const is_on_process = ref(false);
const is_processing = ref(false);
const has_error = ref(false);
const bill_form = ref<VForm>();
const bill_data = ref(props.data);
const form_data = ref({
  file: [] as File[],
  unique_code: props.data?.unique_code || 0,
  method: null,
  approved_description: `Tagihan telah disetujui pada tanggal ${dateFormatterID(props.data?.due_date)}`,
});

// FUNCTION
const handleSubmit = async () => {
  try {
    is_processing.value = true;

    const params: any = {
      id: btoa(bill_data.value._id),
      approved_description: form_data.value.approved_description,
    };

    await axiosIns.put("/bills/mark-approved", params);

    showActionResult(undefined, undefined, "Tagihan berhasil disetujui!");
    emits("billCollected");
    is_showing_modal.value = false;
  } catch {
    has_error.value = true;
  } finally {
    is_processing.value = false;
  }
};


const validateAndSubmit = async () => {
  bill_form.value?.validate().then(({ valid }) => {
    if (valid) {
      has_error.value = false;
      handleSubmit();
    }
  });
};


// LIFECYCLE HOOK
watch(props, () => {
  bill_data.value = props.data;
  form_data.value.unique_code = props.data?.unique_code || 0;
});
</script>

<template>
  <div>
    <!-- OPEN MODAL TRIGGER -->
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="info" prepend-icon="tabler-check">
          <VTooltip activator="parent"> Approve Tagihan </VTooltip>
        </VBtn>
      </slot>
    </div>

    <!-- MODAL -->
    <VDialog :model-value="is_showing_modal" width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-checklist" />
          </template>
          <template #title> Setujui Tagihan </template>
        </VCardItem>

        <VCardText>
          <!-- INVOICE DETAILS -->
          <div class="border rounded-lg px-3 py-3">
            <HorizontalTextFormat title="Nama Pelanggan" :value="bill_data.name" />
            <HorizontalTextFormat title="Nomor Layanan" :value="bill_data.service_number" />
            <HorizontalTextFormat title="Periode" :value="dateFormatterID(bill_data.due_date)" />
            <HorizontalTextFormat title="Total Tagihan" :value="'Rp' + thousandSeparator(bill_data.amount)" />
          </div>

          <!-- FORM -->
          <VForm ref="bill_form" class="mt-5" @submit.prevent="validateAndSubmit()">
            <VRow>
              <VCol v-if="has_error" cols="12">
                <VAlert variant="tonal" color="error">
                  Gagal memproses. Silakan coba lagi.
                </VAlert>
              </VCol>

              <!-- CATATAN -->
              <VCol cols="12">
                <VTextarea
                  v-model="form_data.approved_description"
                  rows="2"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Catatan Persetujuan Tagihan <span class="text-error">*</span>
                  </template>

                </VTextarea>
              </VCol>

              <!-- AKSI -->
              <VCol cols="12">
                <div class="d-flex justify-end gap-2">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton
                    :is_on_process="is_processing"
                    type="submit"
                    label="Setujui"
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
