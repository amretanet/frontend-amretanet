<script setup lang="ts">
import {
  dateFormatterID,
  invoiceStatusFormatter,
  thousandSeparator,
} from "@/modules";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";

// INTERFACE
interface IProps {
  data: any;
}

// VARIABLE
const props = defineProps<IProps>();
const is_showing_modal = ref(false);
const invoice_data = ref(props.data);

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
          <VTooltip activator="parent"> Lihat Detail </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="800" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-file-invoice" />
          </template>
          <template #title>
            Rincian Tagihan #{{ invoice_data?.service_number || "" }}
          </template>
        </VCardItem>
        <VCardText id="invoice-detail">
          <VCard variant="tonal" style="box-shadow: none !important">
            <VCardText>
              <div class="text-center mb-2">
                <img src="/short-logo.png" style="height: 80px" />
                <div class="font-weight-black">AMRETA NETWORK</div>
                <div>Solusi Internet Unlimited</div>
                <div class="fs-12">
                  whatsapp: 08999094340 | email: sandi@amreta.net
                </div>
                <div class="fs-12">Cipacing, Jatinangor</div>
              </div>
              <VDivider> </VDivider>
              <div class="d-flex justify-end mt-2">
                <div class="fs-18 font-weight-black text-primary">INVOICE</div>
              </div>
              <div class="d-flex justify-end mt-2">
                <div class="fs-16">
                  Periode
                  {{
                    invoice_data?.due_date
                      ? dateFormatterID(invoice_data.due_date)
                      : "-"
                  }}
                </div>
              </div>
              <div class="d-flex justify-end mt-2">
                <VChip
                  :color="invoiceStatusFormatter(invoice_data.status).color"
                  class="font-weight-bold"
                >
                  {{ invoiceStatusFormatter(invoice_data.status).type }}
                </VChip>
              </div>
              <div class="mt-2">
                <HorizontalTextFormat
                  title="Nama Pelanggan"
                  :value="invoice_data.name"
                />
                <HorizontalTextFormat
                  title="Nomor Layanan"
                  :value="invoice_data.service_number"
                />
                <HorizontalTextFormat
                  title="Tanggal Invoice"
                  :value="dateFormatterID(invoice_data.created_at)"
                />
                <HorizontalTextFormat
                  title="Jatuh Tempo"
                  :value="dateFormatterID(invoice_data.due_date)"
                />
                <div class="mt-10 mb-2">
                  <div>Paket Langganan</div>
                </div>
                <VDivider></VDivider>
                <VTable density="compact">
                  <thead>
                    <tr>
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
              <div
                v-if="
                  invoice_data?.add_on_packages &&
                  invoice_data.add_on_packages.length > 0
                "
                class="mt-2"
              >
                <div class="mt-3 mb-2">
                  <div>Paket Tambahan</div>
                </div>
                <VDivider></VDivider>
                <VTable density="compact">
                  <thead>
                    <tr>
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
              <div class="mt-3">
                <div class="text-right fs-16 font-weight-black px-4">
                  Total : Rp.{{
                    thousandSeparator(
                      invoice_data.package_amount +
                        invoice_data.add_on_package_amount
                    )
                  }}
                </div>
                <div class="text-right fs-14 font-weight-black px-4 mt-5">
                  Kode Unik : {{ invoice_data.unique_code }}
                </div>
                <div
                  class="text-right fs-16 font-weight-black px-4 mt-2 text-primary"
                >
                  Total Bayar : Rp.{{ thousandSeparator(invoice_data.amount) }}
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
<style>
@media print {
  @page {
    margin: 0; /* Hilangkan margin untuk menghapus header dan footer default */
  }
  body {
    margin: 0;
  }
}
</style>
