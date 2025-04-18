<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult, thousandSeparator } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import moment from "moment";
import HorizontalTextFormat from "../HorizontalTextFormat.vue";
import DatePicker from "@/page-components/DatePicker.vue";
import { stateManagement } from "@/store";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "feeAccepted"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  method: [
    {
      title: "CASH",
      value: "CASH",
    },
    {
      title: "TRANSFER",
      value: "TRANSFER",
    },
  ],
});
const pay_off_fee_form = ref<VForm>();
const pay_off_fee_data = ref({
  _id: props.data._id,
  name: props.data.name,
  email: props.data.email,
  phone_number: props.data.phone_number,
  reason: props.data.reason,
  method: null,
  date: moment().format("YYYY-MM-DD HH:mm:ss"),
  saldo: props.data.saldo,
  nominal: props.data.nominal,
  description: "",
});

// FUNCTION
const acceptMitraFee = () => {
  pay_off_fee_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      const params = {
        status: "ACCEPTED",
        date: pay_off_fee_data.value.date,
        nominal: pay_off_fee_data.value.nominal,
        description: pay_off_fee_data.value.description,
        method: pay_off_fee_data.value.method,
      };
      axiosIns
        .put(`referral-fee/update/${pay_off_fee_data.value._id}`, {
          data: params,
        })
        .then(() => {
          showActionResult(
            undefined,
            undefined,
            "Bonus Mitra Telah Dibayarkan!"
          );
          emits("feeAccepted");
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
  pay_off_fee_data.value._id = props.data._id;
  pay_off_fee_data.value.name = props.data.name;
  pay_off_fee_data.value.email = props.data.email;
  pay_off_fee_data.value.phone_number = props.data.phone_number;
  pay_off_fee_data.value.reason = props.data.reason;
  pay_off_fee_data.value.saldo = props.data.saldo;
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button"> </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="mdi-wallet" />
          </template>
          <template #title> Bayar Bonus Mitra </template>
        </VCardItem>
        <VCardText>
          <!-- NAME -->
          <HorizontalTextFormat
            title="Nama"
            :value="pay_off_fee_data.name"
            :title_cols="4"
            :value_cols="8"
          />
          <!-- EMAIL -->
          <HorizontalTextFormat
            title="Email"
            :value="pay_off_fee_data.email"
            :title_cols="4"
            :value_cols="8"
          />
          <!-- PHONE NUMBER -->
          <HorizontalTextFormat
            title="Nomor Telepon"
            :value="'0' + pay_off_fee_data.phone_number"
            :title_cols="4"
            :value_cols="8"
          />
          <!-- SALDO -->
          <HorizontalTextFormat
            title="Jumlah Saldo"
            :title_cols="4"
            :value_cols="8"
          >
            <template #value>
              <div>
                Rp.{{ thousandSeparator(pay_off_fee_data?.saldo || 0) }}
              </div>
            </template>
          </HorizontalTextFormat>
          <!-- REASON -->
          <HorizontalTextFormat
            v-if="pay_off_fee_data.reason"
            title="Alasan"
            :title_cols="4"
            :value_cols="8"
            :value="pay_off_fee_data.reason"
          />
          <VForm
            ref="pay_off_fee_form"
            @submit.prevent="acceptMitraFee"
            class="mt-2"
          >
            <VRow>
              <!-- PAYED AMOUNT -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="pay_off_fee_data.nominal"
                  type="number"
                  readonly
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Jumlah Dibayarkan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- METHOD -->
              <VCol cols="12" md="6" sm="12">
                <VAutocomplete
                  v-model="pay_off_fee_data.method"
                  :items="options.method"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Metode <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- DATE -->
              <VCol cols="12">
                <DatePicker v-model:date="pay_off_fee_data.date">
                  <template #label>
                    Tanggal <span class="text-error">*</span>
                  </template>
                </DatePicker>
              </VCol>
              <!-- DESKRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="pay_off_fee_data.description"
                  label="Keterangan"
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
