<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import ProcessButton from "./ProcessButton.vue";
import EmptyAlert from "./EmptyAlert.vue";
import {
  dateFormatterID,
  invoiceStatusFormatter,
  numberToWords,
  thousandSeparator,
} from "@/modules";
import { VForm } from "vuetify/components";
import { requiredValidator } from "@/@core/utils/validators";
import HorizontalTextFormat from "./HorizontalTextFormat.vue";

// VARIABLE
const check_form = ref<VForm>();
const key = ref("");
const customer_data = ref<any>(null);
const is_checked = ref(false);
const is_loading = ref(false);
const is_showing_modal = ref(false);

// FUNCTION
const checkCustomerData = () => {
  check_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_loading.value = true;
      axiosIns
        .get(`customer/check-data/${parseInt(key.value)}`)
        .then((res) => {
          customer_data.value = res?.data?.customer_data || null;
        })
        .catch(() => {
          customer_data.value = null;
        })
        .finally(() => {
          is_loading.value = false;
          is_checked.value = true;
        });
    }
  });
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  is_checked.value = false;
  check_form.value?.reset();
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button"> </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="650" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="mdi-account-star" />
          </template>
          <template #title> Cek Data Pelanggan </template>
        </VCardItem>
        <VCardText>
          <VForm ref="check_form" @submit.prevent="checkCustomerData">
            <VRow>
              <VCol cols="12" md="8" sm="12">
                <VTextField
                  v-model="key"
                  autofocus
                  label="Nomor Telepon/Layanan"
                  type="number"
                  placeholder="Masukkan Nomor Telepon atau Layanan Anda"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <ProcessButton
                  size="default"
                  color="primary"
                  text="Cek Data"
                  type="submit"
                  block
                  :is_on_process="is_loading"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardText
          v-if="is_checked && !is_loading"
          class="scroller"
          style="max-height: 60vh"
        >
          <VCard v-if="customer_data" variant="tonal">
            <VCardText>
              <HorizontalTextFormat
                title="Nama Pelanggan"
                :value="customer_data?.name || '-'"
              />
              <HorizontalTextFormat
                title="Nomor Layanan"
                :value="customer_data?.service_number || '-'"
              />
              <HorizontalTextFormat
                title="Nomor Telepon"
                :value="'0' + customer_data?.phone_number || ''"
              />
              <HorizontalTextFormat
                title="Terdaftar Sejak"
                :value="
                  customer_data?.created_at
                    ? dateFormatterID(customer_data.created_at)
                    : '-'
                "
              />
              <HorizontalTextFormat title="Status Tagihan">
                <template #value>
                  <strong
                    :class="
                      'text-' +
                      invoiceStatusFormatter(
                        customer_data?.invoice?.status || 'PAID'
                      ).color
                    "
                  >
                    {{
                      invoiceStatusFormatter(
                        customer_data?.invoice?.status || "PAID"
                      ).type
                    }}
                  </strong>
                </template>
              </HorizontalTextFormat>
              <div v-if="'invoice' in customer_data">
                <HorizontalTextFormat
                  title="Jatuh Tempo"
                  :value="
                    customer_data?.invoice?.due_date
                      ? dateFormatterID(customer_data.invoice?.due_date)
                      : '-'
                  "
                />
                <HorizontalTextFormat
                  title="Total Tagihan"
                  :value="
                    'Rp' +
                    thousandSeparator(customer_data?.invoice?.amount || 0)
                  "
                />
                <HorizontalTextFormat title="Terbilang">
                  <template #value>
                    <strong class="font-italic">
                      {{
                        numberToWords(customer_data?.invoice?.amount || 0) +
                        " Rupiah"
                      }}
                    </strong>
                  </template>
                </HorizontalTextFormat>
              </div>
            </VCardText>
            <VCardText v-if="'invoice' in customer_data">
              <div class="d-flex flex-column gap-2 justify-space-between">
                <a
                  href="https://api.whatsapp.com/send?phone=628999094340"
                  target="_blank"
                >
                  <VBtn
                    size="small"
                    block
                    color="success"
                    prepend-icon="mdi-whatsapp"
                  >
                    Hubungi Admin
                  </VBtn>
                </a>
                <VBtn
                  size="small"
                  block
                  color="warning"
                  prepend-icon="mdi-printer"
                >
                  Cetak Invoice
                </VBtn>
                <VBtn
                  size="small"
                  block
                  color="primary"
                  prepend-icon="mdi-wallet"
                >
                  Bayar Sekarang
                </VBtn>
              </div>
            </VCardText>
          </VCard>
          <EmptyAlert
            v-else
            title="Mohon Maaf, Data Pelanggan Tidak Ditemukan!"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
