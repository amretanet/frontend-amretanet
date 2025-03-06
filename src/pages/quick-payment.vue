<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import ProcessButton from "@/page-components/ProcessButton.vue";
import EmptyAlert from "@/page-components/EmptyAlert.vue";
import { showActionResult, uploadImageFile } from "@/modules";
import { VForm } from "vuetify/components";
import { requiredValidator } from "@/@core/utils/validators";
import { payment_method_options } from "@/modules/options";

// VARIABLE
const routes = useRoute();
const invoice_id = ref(routes?.query?.id || "");
const manual_payment_form = ref<VForm>();
const manual_payment_data = ref({
  file: [] as File[],
  description: "",
  method: null,
});
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
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div style="display: grid; place-items: center">
        <VCard>
          <VCardText>
            <div v-if="invoice_id">
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
            <div v-else style="width: 80vw">
              <EmptyAlert />
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
