<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import {
  dateFormatterID,
  showActionResult,
  thousandSeparator,
  uploadImageFile
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
  description: `Bukti Pelunasan Tagihan Periode ${dateFormatterID(props.data?.due_date)}`,
});

// FUNCTION
const handleSubmit = async () => {
  try {
    is_processing.value = true;
    let params: any = {
      unique_code: form_data.value.unique_code,
      method: form_data.value.method,
      description: form_data.value.description,
    };

    if (form_data.value.file.length > 0) {
      const image_url = await uploadImageFile(
        form_data.value.file[0],
        "payment_evidence"
      );
      if (!image_url) {
        has_error.value = true;
        return;
      }
      params.image_url = image_url;
    }

    axiosIns.put(`bills/pay-off/${bill_data.value._id}`, {
      data: params,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Tagihan berhasil dikoleksi!");
      emits("billCollected");
      });

    ;
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
        <VBtn
          size="small"
          color="info"
          block
          prepend-icon="tabler-check"
        >
          Bill Terambil
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
          <template #title> Bukti Koleksi Tagihan </template>
        </VCardItem>

        <VCardText>
          <!-- INVOICE DETAILS -->
          <div class="border rounded-lg px-3 py-3">
            <HorizontalTextFormat title="Nama Pelanggan" :value="bill_data.name" />
            <HorizontalTextFormat title="Nomor Layanan" :value="bill_data.service_number" />
            <HorizontalTextFormat title="Periode" :value="dateFormatterID(bill_data.due_date)" />
            <HorizontalTextFormat title="Total Tagihan" :value="'Rp' + thousandSeparator(bill_data.amount)" />
          </div>

          <!-- PAYMENT CONFIRMATION FORM -->
          <VForm ref="bill_form" class="mt-5" @submit.prevent="validateAndSubmit()">
            <VRow>
              <!-- ERROR ALERT -->
              <VCol v-if="has_error" cols="12">
                <VAlert variant="tonal" color="error">
                  Gagal memproses pelunasan tagihan. Silakan coba lagi.
                </VAlert>
              </VCol>

              <!-- UNIQUE CODE -->
              <VCol cols="12" md="4">
                <VTextField
                  v-model="form_data.unique_code"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kode Unik <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>

              <!-- METHOD -->
              <VCol cols="12" md="8">
                <VSelect
                  v-model="form_data.method"
                  :items="options.payment_method.filter(el => el.value !== 'VIRTUAL ACCOUNT')"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Metode Pembayaran <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>

              <!-- PAYMENT IMAGE -->
              <VCol
                v-if="['QRIS', 'TRANSFER'].includes(form_data.method)"
                cols="12"
              >
                <VFileInput
                  v-model="form_data.file"
                  accept="image/*"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Bukti Pembayaran <span class="text-error">*</span>
                  </template>
                </VFileInput>
              </VCol>

              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="form_data.description"
                  rows="2"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Catatan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>

              <!-- ACTIONS -->
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
