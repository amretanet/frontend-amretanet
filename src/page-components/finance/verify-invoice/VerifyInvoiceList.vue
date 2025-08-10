<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  requestedStatusFormatter,
  paymentStatusFormatter,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import { month_options, year_options } from "@/modules/options";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import axios from "axios";
import InvoiceDetailModal from "../invoice/InvoiceDetailModal.vue";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  owner_verified_status: "PENDING",
  month: null,
  year: null,
});
const is_check_all = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const sorting_data = ref({
  key: "due_date",
  direction: "asc",
});
const options = ref({
  month: month_options,
  year: year_options,
  sorting_key: [
    {
      title: "Nama",
      value: "name",
    },
    {
      title: "Nomor Layanan",
      value: "service_number",
    },
    {
      title: "Periode",
      value: "due_date",
    },
    {
      title: "Total Pembayaran",
      value: "amount",
    },
  ],
  verified_status: [
    {
      title: "DISETUJUI",
      value: "ACCEPTED",
    },
    {
      title: "DITOLAK",
      value: "REJECTED",
    },
    {
      title: "MENUNGGU KONFIRMASI",
      value: "PENDING",
    },
  ],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const invoice_table_data = ref({
  headers: [
    {
      title: "CHECKBOX",
      key: "checkbox",
      th_class: "text-center",
      td_class: "text-center",
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
      title: "PERIODE",
      key: "due_date",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
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
      title: "STATUS VERIFIKASI OWNER",
      key: "owner_verified_status",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "AKSI",
      key: "action",
      th_class: "text-center",
      td_class: "text-center",
    },
  ],
  body: [],
});
const checked_invoice_data = computed(() => {
  const checked_data = invoice_table_data.value.body
    .filter((el: any) => el.is_checked === true)
    .map((el: any) => el._id);
  return checked_data;
});

// FUNCTION
const getVerifyInvoiceData = (
  is_reset_page: boolean = false,
  is_refresh: boolean = false
) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (is_reset_page) {
    pagination.value.page = 1;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    status: "PAID",
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    ...(filter_data.value.owner_verified_status !== null
      ? { owner_verified_status: filter_data.value.owner_verified_status }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
    sort_key: sorting_data.value.key,
    sort_direction: sorting_data.value.direction,
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
const checkAll = () => {
  const check_all = !is_check_all.value;
  invoice_table_data.value.body.forEach(
    (el: any) => (el.is_checked = check_all)
  );
};
const checkItemChecked = () => {
  if (
    invoice_table_data.value.body.length !== 0 &&
    checked_invoice_data.value.length === invoice_table_data.value.body.length
  ) {
    is_check_all.value = true;
  } else {
    is_check_all.value = false;
  }
};
const changeSortDirection = () => {
  sorting_data.value.direction =
    sorting_data.value.direction === "asc" ? "desc" : "asc";
};
const updateVerifiedStatusSelectedInvoice = async (status: string) => {
  const formatted_status = requestedStatusFormatter(status).title;
  const is_confirmed = await confirmAction(
    `${
      status == "ACCEPTED" ? "Setujui" : "Tolak"
    } Pembayaran Invoice Terpilih?`,
    `Status Verifikasi Invoice yang dipilih akan diubah menjadi ${formatted_status}`,
    `Ya, ${status == "ACCEPTED" ? "Setujui" : "Tolak"}!`
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(checked_invoice_data.value.join(",")),
      owner_verified_status: status,
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .put(`invoice/update/owner-verified-status?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Status Verifikasi Invoice Telah Diubah"
        );
        getVerifyInvoiceData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};
const updateVerifiedStatus = async (
  id: string,
  status: string,
  name: string
) => {
  const formatted_status = requestedStatusFormatter(status).title;
  const is_confirmed = await confirmAction(
    `${status == "ACCEPTED" ? "Setujui" : "Tolak"} Pembayaran Invoice ${name}?`,
    `Status Verifikasi Invoice ${name} akan diubah menjadi ${formatted_status}`,
    `Ya, ${status == "ACCEPTED" ? "Setujui" : "Tolak"}!`
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(id),
      owner_verified_status: status,
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .put(`invoice/update/owner-verified-status?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Status Verifikasi Invoice Telah Diubah"
        );
        getVerifyInvoiceData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getVerifyInvoiceData();
});
watch(checked_invoice_data, () => {
  checkItemChecked();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-checklist" />
      </template>
      <template #title> Daftar Verifikasi Tagihan </template>
    </VCardItem>
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getVerifyInvoiceData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getVerifyInvoiceData(false, true)"
        />
        <!-- BULK ACTION BUTTON -->
        <VBtn
          size="40"
          prepend-icon="mdi-dots-vertical"
          :disabled="checked_invoice_data.length === 0"
        >
          <VMenu activator="parent">
            <VCard>
              <VCardText class="px-2 py-2 d-flex flex-column gap-2">
                <!-- ACCEPT BUTTON -->
                <VBtn
                  size="small"
                  color="success"
                  prepend-icon="tabler-checks"
                  @click="updateVerifiedStatusSelectedInvoice('ACCEPTED')"
                >
                  Setujui Pembayaran
                </VBtn>
                <!-- REJECT BUTTON -->
                <VBtn
                  size="small"
                  color="error"
                  prepend-icon="tabler-x"
                  @click="updateVerifiedStatusSelectedInvoice('REJECTED')"
                >
                  Tolak Pembayaran
                </VBtn>
              </VCardText>
            </VCard>
          </VMenu>
        </VBtn>
        <div class="d-flex gap-2 flex-nowrap">
          <div style="min-width: 10rem">
            <VSelect
              v-model="sorting_data.key"
              :items="options.sorting_key"
              label="Urut Berdasarkan"
              @update:model-value="getVerifyInvoiceData(false, true)"
            />
          </div>
          <VBtn
            size="40"
            color="secondary"
            @click="changeSortDirection(), getVerifyInvoiceData(false, true)"
          >
            <VIcon
              :icon="
                sorting_data.direction == 'asc'
                  ? 'tabler-sort-ascending'
                  : 'tabler-sort-descending'
              "
            />
            <VTooltip activator="parent">
              {{
                sorting_data.direction == "asc"
                  ? "Ascending (A-Z)"
                  : "Descending (Z-A)"
              }}
            </VTooltip>
          </VBtn>
        </div>
        <VSpacer />
        <!-- OWNER VERIFIED FILTER -->
        <div class="wm-100" style="min-width: 12rem">
          <VSelect
            v-model="filter_data.owner_verified_status"
            label="Status Verifikasi"
            :items="options.verified_status"
            clearable
            @update:model-value="getVerifyInvoiceData(true)"
          />
        </div>
        <!-- MONTH FILTER -->
        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.month"
            label="Bulan"
            :items="options.month"
            clearable
            @update:model-value="getVerifyInvoiceData(true)"
          />
        </div>
        <!-- YEAR FILTER -->
        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.year"
            label="Tahun"
            :items="options.year"
            clearable
            @update:model-value="getVerifyInvoiceData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getVerifyInvoiceData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- DATA TABLE -->
    <div>
      <DataTable
        height="60vh"
        :headers="invoice_table_data.headers"
        :body="invoice_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- CUSTOM CHECK ALL -->
        <template #head-CHECKBOX>
          <div style="width: 20px">
            <VCheckbox v-model="is_check_all" @click="checkAll()" />
          </div>
        </template>
        <!-- CUSTOM CHECK ITEM -->
        <template #cell-checkbox="{ data }">
          <VCheckbox v-model="data.is_checked" />
        </template>
        <!-- CUSTOM SERVICE NUMBER -->
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.service_number }}
          </VChip>
        </template>
        <!-- CUSTOM DUE DATE -->
        <template #cell-due_date="{ data }">
          {{ dateFormatterID(data?.due_date) }}
        </template>
        <!-- CUSTOM AMOUNT -->
        <template #cell-amount="{ data }">
          Rp{{ thousandSeparator(data?.amount || 0) }}
        </template>
        <!-- CUSTOM STATUS -->
        <template #cell-status="{ data }">
          <VChip
            :color="paymentStatusFormatter(data.status).color"
            variant="outlined"
          >
            <strong>{{ paymentStatusFormatter(data.status).title }}</strong>
          </VChip>
        </template>
        <!-- CUSTOM OWNER VERIFIED STATUS -->
        <template #cell-owner_verified_status="{ data }">
          <VChip
            :color="requestedStatusFormatter(data?.owner_verified_status).color"
            variant="outlined"
          >
            <strong>
              {{ requestedStatusFormatter(data?.owner_verified_status).title }}
            </strong>
          </VChip>
        </template>
        <!-- CUSTOM ACTION -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <!-- DETAIL BUTTON -->
            <InvoiceDetailModal
              :data="data"
              @invoice-confirmed="getVerifyInvoiceData()"
            />
            <!-- ACCEPT BUTTON -->
            <VBtn
              v-if="data?.owner_verified_status != 'ACCEPTED'"
              size="35"
              color="primary"
              prepend-icon="tabler-checks"
              @click="updateVerifiedStatus(data?._id, 'ACCEPTED', data?.name)"
            >
              <VTooltip activator="parent"> Setujui Pembayaran </VTooltip>
            </VBtn>
            <!-- REJECT BUTTON -->
            <VBtn
              v-if="data?.owner_verified_status != 'REJECTED'"
              size="35"
              color="error"
              prepend-icon="tabler-x"
              @click="updateVerifiedStatus(data?._id, 'REJECTED', data?.name)"
            >
              <VTooltip activator="parent"> Tolak Pembayaran </VTooltip>
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
              @update:model-value="getVerifyInvoiceData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
