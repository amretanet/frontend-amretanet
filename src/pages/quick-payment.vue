<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import ProcessButton from "@/page-components/ProcessButton.vue";
import EmptyAlert from "@/page-components/EmptyAlert.vue";
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
import { payment_method_options } from "@/modules/options";
import { IObjectKeys } from "@/models";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";
import SkeletonLoader from "@/page-components/SkeletonLoader.vue";

// VARIABLE
const routes = useRoute();
const invoice_data = ref<any>(null);
const invoice_id = ref(routes?.query?.id || "");
const manual_payment_form = ref<VForm>();
const manual_payment_data = ref({
  file: [] as File[],
  description: "",
  method: null,
});
const is_loading = ref(false);
const is_payment_error = ref(false);
const is_confirm_error = ref(false);
const is_payment = ref(false);
const is_showing_modal = ref(false);
const is_payment_on_creating = ref(false);
const is_confirm_on_creating = ref(false);
const options = ref({
  payment_channel: [],
  payment_method: payment_method_options,
});

// FUNCTION
const getInvoiceDetail = () => {
  is_loading.value = true;
  axiosIns
    .get(`invoice/detail/${invoice_id.value}`)
    .then((res) => {
      invoice_data.value = res?.data?.invoice_data || null;
    })
    .finally(() => {
      is_loading.value = false;
    });
};
const createPayment = () => {
  is_payment_error.value = false;
  is_payment_on_creating.value = true;
  axiosIns
    .post(`payment/ipaymu/add/${invoice_id.value}`)
    .then((res) => {
      const checkout_url = res?.data?.payment_url || null;
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
      .put(`payment/request-confirm/${invoice_id.value}`, {
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
const printInvoice = (id: string) => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  const params: IObjectKeys = {
    id: btoa(id),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const url = `${domain}/invoice/pdf?${query}`;
  window.open(url);
};

// LIFECYCLE HOOKS
onMounted(() => {
  getInvoiceDetail();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div style="display: grid; place-items: center">
        <VCard>
          <VCardText>
            <div v-if="is_loading" style="width: 80vw">
              <SkeletonLoader height="20rem" width="100%" rounded="18px" />
            </div>
            <div v-else>
              <VCardText>
                <div v-if="invoice_data">
                  <VCardText>
                    <VCard variant="tonal">
                      <VCardText>
                        <HorizontalTextFormat
                          title="Nama Pelanggan"
                          :value="invoice_data?.name || '-'"
                        />
                        <HorizontalTextFormat
                          title="Nomor Layanan"
                          :value="invoice_data?.service_number || '-'"
                        />
                        <HorizontalTextFormat title="Status Tagihan">
                          <template #value>
                            <strong
                              :class="
                                'text-' +
                                paymentStatusFormatter(
                                  invoice_data?.status || 'PAID'
                                ).color
                              "
                            >
                              {{
                                paymentStatusFormatter(
                                  invoice_data?.status || "PAID"
                                ).title
                              }}
                            </strong>
                          </template>
                        </HorizontalTextFormat>
                        <HorizontalTextFormat
                          title="Jatuh Tempo"
                          :value="
                            invoice_data?.due_date
                              ? dateFormatterID(invoice_data.due_date)
                              : '-'
                          "
                        />
                        <HorizontalTextFormat
                          title="Total Tagihan"
                          :value="
                            'Rp' + thousandSeparator(invoice_data?.amount || 0)
                          "
                        />
                        <HorizontalTextFormat title="Terbilang">
                          <template #value>
                            <strong class="font-italic">
                              {{
                                numberToWords(invoice_data?.amount || 0) +
                                " Rupiah"
                              }}
                            </strong>
                          </template>
                        </HorizontalTextFormat>
                      </VCardText>
                      <VCardText v-if="'invoice' in invoice_data">
                        <div
                          class="d-flex flex-column gap-2 justify-space-between"
                        >
                          <a
                            href="https://api.whatsapp.com/send?phone=6285159979915"
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
                            @click="printInvoice(invoice_data.invoice._id)"
                          >
                            Cetak Tagihan
                          </VBtn>
                          <VBtn
                            v-if="invoice_data?.status === 'UNPAID'"
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
                  </VCardText>
                  <div>
                    <div class="text-center font-weight-black mt-10">
                      -- PEMBAYARAN --
                    </div>
                    <!-- AUTOMATIC PAYMENT -->
                    <VCardText>
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
                    <VCardText>
                      <VCard variant="tonal">
                        <VCardItem>
                          <template #title>
                            <span class="fs-18">
                              Konfirmasi Pembayaran Manual
                            </span>
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
                                Metode Pembayaran
                                <span class="text-error">*</span>
                              </template>
                            </VSelect>
                            <VFileInput
                              v-model="manual_payment_data.file"
                              accept="image/*"
                              :rules="[requiredValidator]"
                            >
                              <template #label>
                                Bukti Pembayaran
                                <span class="text-error">*</span>
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
                    <VCardText>
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
                            <div
                              class="mt-5 d-flex justify-space-between gap-2"
                            >
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
                <div v-else style="width: 80vw">
                  <EmptyAlert
                    title="Mohon Maaf, Data Pelanggan Tidak Ditemukan!"
                  />
                </div>
              </VCardText>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  title: Quick Payment
  layout: blank
</route>
