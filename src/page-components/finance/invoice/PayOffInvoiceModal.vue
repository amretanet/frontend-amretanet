<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import {
  dateFormatterID,
  showActionResult,
  thousandSeparator,
  uploadImageFile,
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
  (e: "invoicePayOff"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const options = ref({
  payment_method: payment_method_options,
});
const is_showing_modal = ref(false);
const is_pay_off_process = ref(false);
const is_pay_off_error = ref(false);
const pay_off_payment_form = ref<VForm>();
const pay_off_payment_data = ref({
  file: [] as File[],
  unique_code: props.data?.unique_code || 0,
  method: null,
  description: `Pembayaran Tagihan Periode ${dateFormatterID(
    props.data?.due_date
  )}`,
});
const invoice_data = ref(props.data);

// FUNCTION
const payOffPayment = async () => {
  try {
    is_pay_off_process.value = true;
    let params: any = {
      unique_code: pay_off_payment_data.value.unique_code,
      description: pay_off_payment_data.value.description,
      method: pay_off_payment_data.value.method,
    };
    if (pay_off_payment_data.value.file.length > 0) {
      const image_url = await uploadImageFile(
        pay_off_payment_data.value.file[0],
        "payment_evidence"
      );
      if (!image_url) {
        is_pay_off_error.value = true;
        return;
      }
      params.image_url = image_url;
    }

    axiosIns
      .put(`payment/pay-off/${invoice_data.value?._id}`, {
        data: params,
      })
      .then(() => {
        is_showing_modal.value = false;
        showActionResult(undefined, undefined, "Tagihan Telah Dilunasi!");
        emits("invoicePayOff");
      })
      .catch(() => {
        is_pay_off_error.value = true;
      })
      .finally(() => {
        is_pay_off_process.value = false;
      });
  } catch (error) {
    is_pay_off_error.value = true;
    is_pay_off_process.value = false;
  }
};
const validateConfirmForm = async () => {
  pay_off_payment_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_pay_off_process.value = true;
      is_pay_off_error.value = false;
      payOffPayment();
    }
  });
};

// LIFECYCLE HOOKS
watch(props, () => {
  invoice_data.value = props.data;
  pay_off_payment_data.value.unique_code = invoice_data.value.unique_code || 0;
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn
          size="small"
          color="info"
          block
          prepend-icon="tabler-premium-rights"
        >
          Lunasi Tagihan
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-checklist" />
          </template>
          <template #title> Lunasi Tagihan </template>
        </VCardItem>
        <VCardText>
          <!-- INVOICE DETAIL -->
          <div class="border rounded-lg px-3 py-3">
            <!-- NAME -->
            <HorizontalTextFormat
              title="Nama Pelanggan"
              :value="invoice_data.name"
            />
            <!-- SERVICE NUMBER -->
            <HorizontalTextFormat
              title="Nomor Layanan"
              :value="invoice_data.service_number"
            />
            <!-- PERIODE -->
            <HorizontalTextFormat
              title="Periode"
              :value="dateFormatterID(invoice_data.due_date)"
            />
            <!-- AMOUNT -->
            <HorizontalTextFormat
              title="Total Tagihan"
              :value="'Rp' + thousandSeparator(invoice_data.amount)"
            />
          </div>
          <!-- PAYMENT FORM -->
          <VForm
            ref="pay_off_payment_form"
            class="mt-5"
            @submit.prevent="validateConfirmForm()"
          >
            <VRow>
              <!-- ERROR MESSAGE -->
              <VCol v-if="is_pay_off_error" cols="12">
                <VAlert variant="tonal" color="error">
                  Mohon Maaf, Gagal Memproses Lunasi Tagihan!
                </VAlert>
              </VCol>
              <!-- UNIQUE CODE -->
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="pay_off_payment_data.unique_code"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kode Unik <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PAYMENT METHOD -->
              <VCol cols="12" md="8" sm="12">
                <VSelect
                  v-model="pay_off_payment_data.method"
                  :items="options.payment_method.filter((el:any)=>el.value != 'VIRTUAL ACCOUNT')"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Metode Pembayaran <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- PAYMENT IMAGE -->
              <VCol
                v-if="
                  pay_off_payment_data.method &&
                  ['QRIS', 'TRANSFER'].includes(pay_off_payment_data.method)
                "
                cols="12"
              >
                <VFileInput
                  v-model="pay_off_payment_data.file"
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
                  v-model="pay_off_payment_data.description"
                  rows="2"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Catatan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <!-- ACTION BUTTON -->
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
                    :is_on_process="is_pay_off_process"
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
