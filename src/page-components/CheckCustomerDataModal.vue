<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import ProcessButton from "./ProcessButton.vue";
import EmptyAlert from "./EmptyAlert.vue";
import {
  dateFormatterID,
  paymentStatusFormatter,
  numberToWords,
  showActionResult,
  thousandSeparator,
  uploadImageFile,
} from "@/modules";
import { VForm } from "vuetify/components";
import { requiredValidator } from "@/@core/utils/validators";
import HorizontalTextFormat from "./HorizontalTextFormat.vue";
import { useThemeConfig } from "@/@core/composable/useThemeConfig";
import { IObjectKeys } from "@/models";
import { payment_method_options } from "@/modules/options";

// VARIABLE
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const check_form = ref<VForm>();
const key = ref("");
const customer_data = ref<any>(null);
const automatic_payment_form = ref<VForm>();
const automatic_payment_data = ref({
  channel: null,
});
const manual_payment_form = ref<VForm>();
const manual_payment_data = ref({
  file: [] as File[],
  description: "",
  method: null,
});
const is_payment_error = ref(false);
const is_confirm_error = ref(false);
const is_payment = ref(false);
const is_checked = ref(false);
const is_loading = ref(false);
const is_showing_modal = ref(false);
const is_payment_on_creating = ref(false);
const is_confirm_on_creating = ref(false);
const options = ref({
  payment_channel: [],
  payment_method: payment_method_options,
});

// FUNCTION
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
  is_payment_error.value = false;
  is_payment_on_creating.value = true;
  axiosIns
    .post(`payment/virtual-account/add/${customer_data.value?.invoice?._id}`)
    .then((res) => {
      const checkout_url = res?.data?.paymentUrl || null;
      if (!checkout_url) {
        is_payment_error.value = true;
        return;
      }
      window.open(checkout_url);
    })
    .catch((err) => {
      is_payment_error.value = true;
    })
    .finally(() => {
      is_payment_on_creating.value = false;
    });
};
const printInvoice = (id: string) => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  const params: IObjectKeys = {
    id: btoa(id),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const url = `${domain}invoice/pdf?${query}`;
  window.open(url);
};
const confirmPayment = async () => {
  try {
    is_confirm_on_creating.value = true;
    is_confirm_error.value = false;
    const image_url = await uploadImageFile(
      manual_payment_data.value.file[0],
      "payment_evidence"
    );
    if (!image_url) {
      is_confirm_error.value = true;
      return;
    }
    const params = {
      image_url: image_url,
      description: manual_payment_data.value.description,
      method: manual_payment_data.value.method,
    };
    axiosIns
      .put(`payment/request-confirm/${customer_data.value.invoice?._id}`, {
        data: params,
      })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Konfirmasi Pembayaran Telah Dikirimkan!"
        );
        is_showing_modal.value = false;
      })
      .catch(() => {
        is_confirm_error.value = true;
      })
      .finally(() => {
        is_confirm_on_creating.value = false;
      });
  } catch (error) {
    is_confirm_error.value = true;
  }
};
const validateConfirmForm = async () => {
  manual_payment_form.value?.validate().then((form) => {
    if (form.valid) {
      confirmPayment();
    }
  });
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  automatic_payment_data.value.channel = null;
  is_checked.value = false;
  is_payment.value = false;
  check_form.value?.reset();
  automatic_payment_form.value?.reset();
  manual_payment_form.value?.reset();
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
                    customer_data?.registered_at
                      ? dateFormatterID(customer_data.registered_at)
                      : '-'
                  "
                />
                <HorizontalTextFormat title="Status Tagihan">
                  <template #value>
                    <strong
                      :class="
                        'text-' +
                        paymentStatusFormatter(
                          customer_data?.invoice?.status || 'PAID'
                        ).color
                      "
                    >
                      {{
                        paymentStatusFormatter(
                          customer_data?.invoice?.status || "PAID"
                        ).title
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
                    @click="printInvoice(customer_data.invoice._id)"
                  >
                    Cetak Tagihan
                  </VBtn>
                  <VBtn
                    v-if="customer_data?.invoice?.status === 'UNPAID'"
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
            <!-- AUTOMATIC PAYMENT -->
            <VCardText class="fade-in">
              <VCard variant="tonal">
                <VCardItem>
                  <template #title>
                    <span class="fs-18"> Pembayaran Otomatis</span>
                  </template>
                </VCardItem>
                <VCardText>
                  <ProcessButton
                    text="Buat Pembayaran Otomatis"
                    color="primary"
                    :is_on_process="is_payment_on_creating"
                    block
                    @click="createPayment()"
                  />
                </VCardText>
              </VCard>
            </VCardText>
            <!-- MANUAL PAYMENT -->
            <VCardText class="fade-in">
              <VCard variant="tonal">
                <VCardItem>
                  <template #title>
                    <span class="fs-18"> Konfirmasi Pembayaran Manual </span>
                  </template>
                </VCardItem>
                <VForm
                  ref="manual_payment_form"
                  @submit.prevent="validateConfirmForm()"
                >
                  <VCardText class="d-flex gap-2 flex-column">
                    <VAlert
                      v-if="is_confirm_error"
                      variant="tonal"
                      color="error"
                    >
                      Mohon Maaf, Gagal Melakukan Konfirmasi Pembayaran!
                    </VAlert>
                    <VSelect
                      v-model="manual_payment_data.method"
                      :items="
                        options.payment_method.filter((el) =>
                          ['TRANSFER', 'QRIS'].includes(el.value)
                        )
                      "
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Metode Pembayaran <span class="text-error">*</span>
                      </template>
                    </VSelect>
                    <VFileInput
                      v-model="manual_payment_data.file"
                      accept="image/*"
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Bukti Pembayaran <span class="text-error">*</span>
                      </template>
                    </VFileInput>
                    <VTextarea
                      v-model="manual_payment_data.description"
                      rows="2"
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Catatan <span class="text-error">*</span>
                      </template>
                    </VTextarea>
                    <div class="d-flex justify-end gap-2">
                      <VBtn
                        size="small"
                        color="error"
                        @click="is_payment = false"
                      >
                        Batal
                      </VBtn>
                      <ProcessButton
                        text="Konfirmasi Pembayaran"
                        color="primary"
                        type="submit"
                        :is_on_process="is_confirm_on_creating"
                      />
                    </div>
                  </VCardText>
                </VForm>
              </VCard>
            </VCardText>
            <!-- QRIS -->
            <VCardText class="fade-in">
              <VCard variant="tonal">
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
