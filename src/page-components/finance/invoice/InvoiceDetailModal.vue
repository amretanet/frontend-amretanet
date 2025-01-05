<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dateFormatterID,
  errorMessage,
  paymentStatusFormatter,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "invoiceConfirmed"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_showing_modal = ref(false);
const invoice_data = ref(props.data);

// FUNCTION
const confirmPayment = async () => {
  is_showing_modal.value = false;
  const is_confirmed = await confirmAction(
    "Konfirmasi Pembayaran?",
    `Pembayaran ${invoice_data.value.name} akan dikonfirmasi`,
    "Ya, Konfirmasi!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(invoice_data.value._id),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .put(`payment/confirm?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Pembayaran Telah Dikonfirmasi!"
        );
        emits("invoiceConfirmed");
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  } else {
    is_showing_modal.value = true;
  }
};

// LIFECYCLE HOOKS
watch(props, () => {
  invoice_data.value = props.data;
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="success" prepend-icon="tabler-eye">
          <VTooltip activator="parent"> Detail </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-file-invoice" />
          </template>
          <template #title> Detail Tagihan </template>
          <template #append>
            <VBtn
              v-if="invoice_data?.status === 'PENDING' && store.isAdmin"
              size="small"
              color="success"
              prepend-icon="tabler-checklist"
              @click="confirmPayment()"
            >
              Konfirmasi
            </VBtn>
          </template>
        </VCardItem>
        <VCardText>
          <div class="scroller" style="max-height: 75vh">
            <!-- NAME -->
            <HorizontalTextFormat
              title="Nama Pelanggan"
              :value="invoice_data.name"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- SERVICE NUMBER -->
            <HorizontalTextFormat
              title="Nomor Layanan"
              :value="invoice_data.service_number"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- STATUS -->
            <HorizontalTextFormat
              title="Status"
              :title_cols="5"
              :value_cols="7"
            >
              <template #value>
                <VChip
                  variant="outlined"
                  :color="paymentStatusFormatter(invoice_data.status).color"
                  class="font-weight-bold"
                >
                  {{ paymentStatusFormatter(invoice_data.status).title }}
                </VChip>
              </template>
            </HorizontalTextFormat>
            <!-- PERIODE -->
            <HorizontalTextFormat
              title="Periode"
              :value="dateFormatterID(invoice_data.due_date)"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- PACKAGE -->
            <div>
              <HorizontalTextFormat
                title="Paket Internet"
                :title_cols="5"
                :value_cols="7"
              />
              <div class="mt-2">
                <VTable density="compact" class="rounded">
                  <thead>
                    <tr class="bg-light-primary">
                      <th>NO</th>
                      <th>NAMA PAKET</th>
                      <th class="text-right">HARGA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in invoice_data.package">
                      <td width="10px">{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td class="text-right">
                        Rp{{ thousandSeparator(item.price.regular) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="text-right font-weight-black">
                          Sub Total : Rp{{
                            thousandSeparator(invoice_data.package_amount || 0)
                          }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </div>
            <!-- ADD ON PACKAGE -->
            <div
              v-if="
                invoice_data?.add_on_packages &&
                invoice_data.add_on_packages.length > 0
              "
              class="mt-2"
            >
              <HorizontalTextFormat
                title="Paket Tambahan"
                :title_cols="5"
                :value_cols="7"
              />
              <div class="mt-2">
                <VTable density="compact" class="rounded">
                  <thead>
                    <tr class="bg-light-primary">
                      <th>NO</th>
                      <th>NAMA PAKET</th>
                      <th class="text-right">HARGA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in invoice_data.add_on_packages">
                      <td width="10px">{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td class="text-right">
                        Rp{{ thousandSeparator(item.price.regular) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div class="text-right font-weight-black">
                          Sub Total : Rp{{
                            thousandSeparator(
                              invoice_data.add_on_package_amount || 0
                            )
                          }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </div>
            <!-- SUB AMMOUNT -->
            <HorizontalTextFormat
              title="Sub Total Tagihan"
              :value="
                'Rp' +
                thousandSeparator(
                  invoice_data.package_amount +
                    invoice_data.add_on_package_amount
                )
              "
              :title_cols="5"
              :value_cols="7"
            />
            <!-- PPN -->
            <HorizontalTextFormat
              title="PPN"
              :value="'Rp' + thousandSeparator(invoice_data.ppn)"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- UNIQUE CODE -->
            <HorizontalTextFormat
              title="Kode Unik"
              :value="thousandSeparator(invoice_data.unique_code)"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- AMOUNT -->
            <HorizontalTextFormat
              title="Total Tagihan"
              :value="'Rp' + thousandSeparator(invoice_data.amount)"
              :title_cols="5"
              :value_cols="7"
            />
            <!-- PAYMENT -->
            <div v-if="invoice_data?.payment">
              <!-- PAYMENT DATE -->
              <HorizontalTextFormat
                title="Tanggal Pembayaran"
                :value="dateFormatterID(invoice_data?.payment?.paid_at)"
                :title_cols="5"
                :value_cols="7"
              />
              <!-- PAYMENT METHOD -->
              <HorizontalTextFormat
                title="Metode Pembayaran"
                :value="invoice_data?.payment?.method"
                :title_cols="5"
                :value_cols="7"
              />
              <!-- PAYMENT DESCRIPTION -->
              <HorizontalTextFormat
                title="Dikonfirmasi Oleh"
                :value="invoice_data?.payment?.confirmed_by"
                :title_cols="5"
                :value_cols="7"
              />
              <!-- PAYMENT DESCRIPTION -->
              <HorizontalTextFormat
                title="Catatan Pembayaran"
                :value="invoice_data?.payment?.description"
                :title_cols="5"
                :value_cols="7"
              />
              <!-- PAYMENT IMAGE -->
              <div v-if="invoice_data?.payment?.image_url">
                <HorizontalTextFormat
                  title="Bukti Pembayaran"
                  :title_cols="5"
                  :value_cols="7"
                />
                <div class="mt-2">
                  <img
                    :src="invoice_data.payment.image_url"
                    alt="payment_image"
                    class="rounded-lg mt-2"
                    style="width: 100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
