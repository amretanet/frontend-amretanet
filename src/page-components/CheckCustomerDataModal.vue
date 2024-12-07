<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import ProcessButton from "./ProcessButton.vue";
import EmptyAlert from "./EmptyAlert.vue";
import {
  dateFormatterID,
  errorMessage,
  invoiceStatusFormatter,
  numberToWords,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import { VForm } from "vuetify/components";
import { requiredValidator } from "@/@core/utils/validators";
import HorizontalTextFormat from "./HorizontalTextFormat.vue";
import { useThemeConfig } from "@/@core/composable/useThemeConfig";

// VARIABLE
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const check_form = ref<VForm>();
const key = ref("");
const customer_data = ref<any>(null);
const payment_data = ref({
  channel: null,
});
const is_payment_error = ref(false);
const is_payment = ref(false);
const is_checked = ref(false);
const is_loading = ref(false);
const is_showing_modal = ref(false);
const is_payment_on_creating = ref(false);
const options = ref({
  payment_channel: [],
});

// FUNCTION
const getPaymentChannel = () => {
  axiosIns.get("payment/channel").then((res) => {
    options.value.payment_channel = res?.data || [];
  });
};
const checkCustomerData = () => {
  check_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_loading.value = true;
      is_payment.value = false;
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
const createPayment = () => {
  const payload = {
    id_invoice: customer_data.value?.invoice?._id || null,
    method: payment_data.value.channel,
  };
  if (!payload.id_invoice || !payload.method) {
    return;
  }
  is_payment_error.value = false;
  is_payment_on_creating.value = true;
  axiosIns
    .post("payment/add", {
      data: payload,
    })
    .then((res) => {
      const checkout_url = res?.data?.checkout_url || null;
      if (!checkout_url) {
        is_payment_error.value = true;
        return;
      }
      window.open(checkout_url);
    })
    .catch((err) => {
      console.log(err);
      is_payment_error.value = true;
    })
    .finally(() => {
      is_payment_on_creating.value = false;
    });
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal) {
    getPaymentChannel();
  }
  payment_data.value.channel = null;
  is_checked.value = false;
  is_payment.value = false;
  check_form.value?.reset();
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button"> </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="600" persistent>
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
            <div class="d-flex gap-2 flex-wrap">
              <VTextField
                v-model="key"
                autofocus
                label="Nomor Telepon/Layanan"
                type="number"
                placeholder="Masukkan Nomor Telepon atau Layanan Anda"
                :rules="[requiredValidator]"
              />
              <ProcessButton
                size="default"
                color="primary"
                text="Cek Data"
                type="submit"
                :block="
                  isLessThanOverlayNavBreakpoint(windowWidth) ? true : false
                "
                :is_on_process="is_loading"
              />
            </div>
          </VForm>
        </VCardText>
        <div class="scroller" style="max-height: 70vh">
          <VCardText v-if="is_checked && !is_loading">
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
                    @click="is_payment = true"
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
          <div v-if="is_payment">
            <div class="text-center font-weight-black">-- PEMBAYARAN --</div>
            <VCardText class="fade-in">
              <VCard variant="tonal">
                <VCardItem>
                  <template #title>
                    <span class="fs-18"> Pembayaran Otomatis</span>
                  </template>
                </VCardItem>
                <VCardText class="d-flex gap-2 flex-column">
                  <VAlert v-if="is_payment_error" variant="tonal" color="error">
                    Mohon Maaf, Pembayaran Belum Dapat Dilakukan!
                  </VAlert>
                  <VAutocomplete
                    v-model="payment_data.channel"
                    label="Metode Pembayaran"
                    :items="options.payment_channel"
                    item-title="name"
                    item-value="code"
                  />
                  <div class="d-flex justify-end gap-2">
                    <VBtn
                      size="small"
                      color="error"
                      @click="is_payment = false"
                    >
                      Batal
                    </VBtn>
                    <ProcessButton
                      text="Buat Pembayaran"
                      :disabled="!payment_data.channel"
                      :is_on_process="is_payment_on_creating"
                      @click="createPayment()"
                    />
                  </div>
                </VCardText>
              </VCard>
            </VCardText>
            <VCardText class="fade-in">
              <VCard variant="tonal">
                <VCardItem>
                  <template #title>
                    <span class="fs-18">Pembayaran QRIS Manual</span>
                  </template>
                </VCardItem>
                <VCardText>
                  <img
                    src="@/assets/images/qris-amretanet.jpg"
                    alt="QRIS"
                    class="rounded-lg"
                    style="width: 100%"
                  />
                  <div class="mt-5">
                    <div class="text-center font-weight-black">
                      Scan Menggunakan Aplikasi:
                    </div>
                    <div class="mt-5 d-flex justify-space-between gap-2">
                      <img
                        src="@/assets/images/logo-shopee.png"
                        alt="Shopee"
                        class="rounded-lg"
                        style="width: 15%"
                      />
                      <img
                        src="@/assets/images/logo-dana.jpg"
                        alt="Dana"
                        class="rounded-lg"
                        style="width: 15%"
                      />
                      <img
                        src="@/assets/images/logo-gopay.png"
                        alt="Gopay"
                        style="width: 15%"
                      />
                      <img
                        src="@/assets/images/logo-linkaja.png"
                        alt="Linkaja"
                        class="rounded-lg"
                        style="width: 15%"
                      />
                      <img
                        src="@/assets/images/logo-ovo.jpg"
                        alt="Ovo"
                        class="rounded-lg"
                        style="width: 15%"
                      />
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCardText>
          </div>
        </div>
      </VCard>
    </VDialog>
  </div>
</template>
