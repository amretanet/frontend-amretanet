<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  invoiceStatusFormatter,
  roleFormatter,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import {
  user_role_customer_options,
  user_role_options,
} from "@/modules/options";
import { stateManagement } from "@/store";
import InvoiceDetailModal from "./InvoiceDetailModal.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_syncronize = ref(false);
const options = ref({
  role: [...user_role_options, ...user_role_customer_options],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const invoice_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA PELANGGAN",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
      width: "25%",
    },
    {
      title: "NOMOR LAYANAN",
      key: "service_number",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "JATUH TEMPO",
      key: "due_date",
      th_class: "text-left",
      td_class: "text-left",
      width: "20%",
    },
    {
      title: "TOTAL PEMBAYARAN",
      key: "amount",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "AKSI",
      key: "action",
      th_class: "text-center",
      td_class: "text-center",
      width: "150px",
    },
  ],
  body: [],
});

// FUNCTION
const getInvoiceData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`invoice?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      invoice_table_data.value.body = res?.data?.invoice_data || [];
      pagination.value.count = res?.data?.pagination_info?.count || 0;
    })
    .catch((err) => {
      if (err.code !== "ERR_CANCELED") {
        cancel_request_token.value = null;
      }
    })
    .finally(() => {
      if (!cancel_request_token.value) {
        is_on_refresh.value = false;
        is_loading.value = false;
      }
    });
};
const deleteInvoice = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Invoice?",
    `Invoice ${name} akan dihapus dari daftar invoice pelanggan`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`invoice/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Invoice Telah Dihapus");
        getInvoiceData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
const syncInvoice = async () => {
  const is_confirmed = await confirmAction(
    "Sinkronkan Tagihan?",
    "Tagihan Pelanggan akan disinkronkan ulang",
    "Ya, Sinkronkan!"
  );
  if (is_confirmed) {
    is_syncronize.value = true;
    axiosIns
      .get(`invoice/generate?is_send_whatsapp=${false}`)
      .then(() => {
        getInvoiceData();
        showActionResult(
          undefined,
          undefined,
          "Tagihan Telah Disinkronkan Ulang"
        );
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        is_syncronize.value = false;
      });
  }
};
const printInvoice = async (id: string, type: string) => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  if (type === "A4") {
    const url = `${domain}/invoice/pdf/${id}`;
    window.open(url);
  } else if (type === "THERMAL") {
    const url = `${domain}/invoice/thermal/${id}`;
    window.open(url);
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getInvoiceData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-file-invoice" />
      </template>
      <template #title> Daftar Invoice Pelanggan </template>
      <template #append>
        <ProcessButton
          text="Sinkronkan Tagihan"
          color="warning"
          :is_on_process="is_syncronize"
          @click="syncInvoice()"
        >
          <template #prepend>
            <VIcon icon="tabler-refresh" />
          </template>
        </ProcessButton>
      </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getInvoiceData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInvoiceData(true)"
        />
        <VSpacer />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getInvoiceData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="invoice_table_data.headers"
        :body="invoice_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.service_number }}
          </VChip>
        </template>
        <template #cell-due_date="{ data }">
          {{ dateFormatterID(data?.due_date) }}
        </template>
        <template #cell-amount="{ data }">
          Rp.{{ thousandSeparator(data?.amount || 0) }}
        </template>
        <template #cell-status="{ data }">
          <VChip
            :color="invoiceStatusFormatter(data.status).color"
            variant="outlined"
          >
            <strong>{{ invoiceStatusFormatter(data.status).type }}</strong>
          </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <VBtn size="35" color="warning">
              <VIcon icon="mdi-printer" />
              <VTooltip activator="parent"> Cetak Invoice </VTooltip>
              <VMenu activator="parent">
                <VCard>
                  <VCardText class="d-flex gap-2 px-2 py-2">
                    <VBtn
                      size="small"
                      variant="outlined"
                      color="dark"
                      prepend-icon="mdi-file"
                      @click="printInvoice(data._id, 'A4')"
                    >
                      A4
                    </VBtn>
                    <VBtn
                      size="small"
                      variant="outlined"
                      color="dark"
                      prepend-icon="mdi-file"
                    >
                      58MM
                    </VBtn>
                    <VBtn
                      size="small"
                      variant="outlined"
                      color="dark"
                      prepend-icon="mdi-file"
                      @click="printInvoice(data._id, 'THERMAL')"
                    >
                      THERMAL
                    </VBtn>
                  </VCardText>
                </VCard>
              </VMenu>
            </VBtn>
            <InvoiceDetailModal :data="data" />
            <VBtn size="35" color="info">
              <VIcon icon="tabler-edit" />
              <VTooltip activator="parent"> Edit </VTooltip>
            </VBtn>
            <VBtn
              size="35"
              color="error"
              @click="deleteInvoice(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
          </div>
        </template>
        <!-- CUSTOM PAGINATION -->
        <template #pagination>
          <div class="d-flex align-center pt-2">
            <h6 class="fs-14 fw-500">
              {{
                dataCountFormatter(
                  pagination.page,
                  pagination.items,
                  pagination.count,
                  invoice_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getInvoiceData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
