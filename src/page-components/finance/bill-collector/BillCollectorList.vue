<script lang="ts" setup>
import { IObjectKeys } from "@/models";
import {
  billCollectorStatusFormatter,
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import {
  bill_collector_status_options,
  month_options,
  year_options,
} from "@/modules/options";
import { stateManagement } from "@/store";

const user = stateManagement();

import DataTable from "@/page-components/DataTable.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import ApproveBillCollectorModal from "@/page-components/finance/bill-collector/ApproveBillCollectorModal.vue";
import BillCollectorDetailModal from "@/page-components/finance/bill-collector/BillCollectorDetailModal.vue";
import EditBillCollectorModal from "@/page-components/finance/bill-collector/EditBillCollectorModal.vue";

import axiosIns from "@/plugins/axios";
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// VARIABLES
const store = stateManagement();
const routes = useRoute();
const router = useRouter();
const cancel_request_token = ref<any>(null);

const filter_data = ref({
  key: "",
  status: routes?.query?.status || null,
  month: null,
  year: null,
});

const is_check_all = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_syncronize = ref(false);

const sorting_data = ref({
  key: "due_date",
  direction: "asc",
});

const options = ref({
  status: bill_collector_status_options,
  month: month_options,
  year: year_options,
  sorting_key: [
    { title: "Nama", value: "name" },
    { title: "Nomor Layanan", value: "service_number" },
    { title: "Periode", value: "due_date" },
    { title: "Total Pembayaran", value: "amount" },
  ],
});

const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});

const collector_table_data = ref({
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
      title: "PETUGAS PENGAMBILAN",
      key: "assigned_to",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
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

// const checked_collector_data = computed(() => {
//   return collector_table_data.value.body
//     .filter((el: any) => el.is_checked === true)
//     .map((el: any) => el._id);
// });
const checked_collector_data = computed(() => {
  const checked_data = collector_table_data.value.body
    .filter((el: any) => el.is_checked === true)
    .map((el: any) => el._id);
  return checked_data;
});
// function
const getCollectorData = (
  is_reset_page: boolean = false,
  is_refresh: boolean = false
) => {
  is_loading.value = true;

  if (is_refresh) is_on_refresh.value = true;
  if (is_reset_page) pagination.value.page = 1;
  if (cancel_request_token.value) cancel_request_token.value.cancel();

  cancel_request_token.value = axios.CancelToken.source();

  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    ...(filter_data.value.status ? { status: filter_data.value.status } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
    sort_key: sorting_data.value.key,
    sort_direction: sorting_data.value.direction,
  };

  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  axiosIns
    .get(`bills?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      collector_table_data.value.body = res?.data?.bill_data || [];
      pagination.value.count = res?.data?.pagination_info?.count || 0;
    })
    .catch((err) => {
      if (err.code !== "ERR_CANCELED") cancel_request_token.value = null;
    })
    .finally(() => {
      if (!cancel_request_token.value) {
        is_loading.value = false;
        is_on_refresh.value = false;
      }
    });
};

const syncCollectorData = async () => {
  const is_confirmed = await confirmAction(
    "Sinkronkan Data?",
    "Data tagihan kolektor akan disinkronkan ulang",
    "Ya, Sinkronkan!"
  );
  if (is_confirmed) {
    is_syncronize.value = true;
    axiosIns
      .get(`collector/sync`)
      .then(() => {
        getCollectorData();
        showActionResult(undefined, undefined, "Data Kolektor Disinkronkan");
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      })
      .finally(() => {
        is_syncronize.value = false;
      });
  }
};
//   const is_confirmed = await confirmAction(
//     "Kirim Whatsapp Pengingat?",
//     `Pesan whatsapp pengingat kepada ${name} akan diambilkan`,
//     "Ya, Kirimkan!"
//   );
//   if (is_confirmed) {
//     store.loadingHandler(true);
//     const params: IObjectKeys = {
//       id: btoa(id),
//     };
//     const query = Object.keys(params)
//       .map((key) => `${key}=${params[key]}`)
//       .join("&");
//     axiosIns
//       .get(`invoice/whatsapp-reminder?${query}`)
//       .then(() => {
//         showActionResult(
//           undefined,
//           undefined,
//           "Pesan Whatsapp Pengingat Telah Dikirimkan!"
//         );
//       })
//       .catch(() => {
//         showActionResult(
//           undefined,
//           "error",
//           "Pesan Whatsapp Gagal Dikirimkan!"
//         );
//       })
//       .finally(() => {
//         store.loadingHandler(false);
//       });
//   }
// };
const printInvoice = async (id: string, type: string) => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  const params: IObjectKeys = {
    id: btoa(id),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  if (type === "A4") {
    const url = `${domain}/invoice/pdf?${query}`;
    window.open(url);
  } else if (type === "THERMAL") {
    const url = `${domain}/invoice/thermal?${query}`;
    window.open(url);
  }
};

const deleteBill = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Tagihan?",
    `Tagihan ${name} akan dihapus dari daftar bill collector`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(id),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .delete(`bills/delete?${query}`)
      .then(() => {
        getCollectorData();
        showActionResult(undefined, undefined, "Bill Tagihan Telah Dihapus");
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

const checkAll = () => {
  const check_all = !is_check_all.value;
  collector_table_data.value.body.forEach((el) => (el.is_checked = check_all));
};

const checkItemChecked = () => {
  is_check_all.value =
    collector_table_data.value.body.length !== 0 &&
    checked_collector_data.value.length ===
      collector_table_data.value.body.length;
};

const deleteSelectedCollector = async () => {
  const is_confirmed = await confirmAction(
    "Hapus Tagihan Terpilih?",
    "Semua tagihan terpilih akan dihapus",
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const query = `id=${btoa(checked_collector_data.value.join(","))}`;
    axiosIns
      .delete(`collector/delete?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Tagihan berhasil dihapus");
        getCollectorData();
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

const sendReminderSelected = async () => {
  const is_confirmed = await confirmAction(
    "Kirim Whatsapp Pengingat?",
    "Pesan akan dikirim ke semua pelanggan terpilih",
    "Ya, Kirimkan!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const query = `id=${btoa(checked_collector_data.value.join(","))}`;
    axiosIns
      .get(`collector/reminder?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pesan berhasil dikirim!");
      })
      .catch(() => {
        showActionResult(true, "error", "Gagal mengirim pesan.");
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};

const removeQueryPath = (key: string) => {
  const current_query = { ...router.currentRoute.value.query };
  if (key in current_query) {
    delete current_query[key];
    router.replace({ query: current_query });
  }
};

const changeSortDirection = () => {
  sorting_data.value.direction =
    sorting_data.value.direction === "asc" ? "desc" : "asc";
};

onMounted(() => {
  getCollectorData();
});
watch(checked_collector_data, () => {
  checkItemChecked();
});
watch(
  () => routes.query,
  () => {
    if (routes.query.status) {
      filter_data.value.status = routes.query.status;
      getCollectorData();
    }
  }
);
</script>

<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-users-group" />
      </template>

      <template #title>
        {{
          store.isCustomer ? "Daftar Penagihan Saya" : "Daftar Bill Collector"
        }}
      </template>

      <template #append>
        <ProcessButton
          v-if="!store.isCustomer"
          text="Sinkronkan Data"
          color="warning"
          :is_on_process="is_syncronize"
          @click="syncCollectorData()"
        >
          <template #prepend>
            <VIcon icon="tabler-refresh" />
          </template>
        </ProcessButton>
      </template>
    </VCardItem>

    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- Items Per Page -->
        <VSelect
          v-model="pagination.items"
          :items="[5, 10, 25, 50, 100]"
          @update:model-value="getCollectorData(true)"
        />

        <!-- Refresh Button -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCollectorData(false, true)"
        />

        <!-- Bulk Actions -->
        <VBtn
          v-if="!store.isCustomer"
          size="40"
          prepend-icon="mdi-dots-vertical"
          :disabled="checked_collector_data.length === 0"
        >
          <VMenu activator="parent">
            <VCard>
              <VCardText class="px-2 py-2 d-flex flex-column gap-2">
                <!-- Send Reminder -->
                <VBtn
                  size="small"
                  color="success"
                  prepend-icon="mdi-whatsapp"
                  @click="sendReminderSelected()"
                >
                  Ingatkan Pelanggan
                </VBtn>

                <!-- Delete -->
                <VBtn
                  size="small"
                  color="error"
                  prepend-icon="tabler-trash"
                  @click="deleteSelectedCollector()"
                >
                  Hapus
                </VBtn>
              </VCardText>
            </VCard>
          </VMenu>
        </VBtn>

        <!-- Sorting Controls -->
        <div
          v-if="store.isOwner || store.isAdmin || store.isCustomerService"
          class="d-flex gap-2 flex-nowrap"
        >
          <div style="min-width: 10rem">
            <VSelect
              v-model="sorting_data.key"
              :items="options.sorting_key"
              label="Urut Berdasarkan"
              @update:model-value="getCollectorData(false, true)"
            />
          </div>

          <VBtn
            size="40"
            color="secondary"
            @click="
              changeSortDirection();
              getCollectorData(false, true);
            "
          >
            <VIcon
              :icon="
                sorting_data.direction === 'asc'
                  ? 'tabler-sort-ascending'
                  : 'tabler-sort-descending'
              "
            />
            <VTooltip activator="parent">
              {{
                sorting_data.direction === "asc"
                  ? "Ascending (A-Z)"
                  : "Descending (Z-A)"
              }}
            </VTooltip>
          </VBtn>
        </div>

        <VSpacer />

        <!-- Filters -->
        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.month"
            label="Bulan"
            :items="options.month"
            clearable
            @update:model-value="getCollectorData(true)"
          />
        </div>

        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.year"
            label="Tahun"
            :items="options.year"
            clearable
            @update:model-value="getCollectorData(true)"
          />
        </div>

        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            label="Status"
            :items="options.status"
            clearable
            @update:model-value="
              removeQueryPath('status');
              getCollectorData(true);
            "
          />
        </div>

        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getCollectorData(true)"
          />
        </div>
      </div>
    </VCardText>

    <!-- DATA TABLE -->
    <div>
      <DataTable
        height="60vh"
        :headers="collector_table_data.headers"
        :body="collector_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- HEAD: Check All -->
        <template #head-CHECKBOX>
          <div style="width: 20px">
            <VCheckbox v-model="is_check_all" @click="checkAll()" />
          </div>
        </template>

        <!-- CELL: Individual Check -->
        <template #cell-checkbox="{ data }">
          <VCheckbox v-model="data.is_checked" />
        </template>

        <!-- CELL: Service Number -->
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.service_number }}
          </VChip>
        </template>

        <!-- CELL: Due Date -->
        <template #cell-due_date="{ data }">
          {{ dateFormatterID(data?.due_date) }}
        </template>

        <!-- CELL: Amount -->
        <template #cell-amount="{ data }">
          Rp{{ thousandSeparator(data?.amount || 0) }}
        </template>

        <!-- CELL: Status -->
        <template #cell-status="{ data }">
          <VChip
            :color="billCollectorStatusFormatter(data.status).color"
            variant="outlined"
          >
            <strong>{{
              billCollectorStatusFormatter(data.status).title
            }}</strong>
          </VChip>
        </template>

        <!-- CELL: Assigned To -->
        <template #cell-assigned_to="{ data }">
          <span class="text-sm text-gray-800">
            {{ data.collector?.assigned_to || "—" }}
          </span>
        </template>

        <!-- CELL: Action -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 justify-center">
            <!-- DETAIL -->
            <BillCollectorDetailModal
              :data="data"
              @collector-updated="getCollectorData()"
            />
            <!-- EDIT BUTTON -->
            <EditBillCollectorModal
              v-if="
                data.status === 'COLLECTING' && !user.isAdmin && !store.isOwner
              "
              :data="data"
              @bill-collected="getCollectorData()"
            />
            <VBtn
              v-if="store.isOwner || user.isAdmin"
              size="35"
              color="warning"
              prepend-icon="mdi-printer"
            >
              <VTooltip activator="parent"> Cetak Tagihan </VTooltip>
              <VMenu activator="parent">
                <VCard>
                  <VCardText class="d-flex gap-2 px-2 py-2">
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
            <VBtn
              v-if="store.isOwner || user.isAdmin"
              size="35"
              color="error"
              @click="deleteBill(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>

            <ApproveBillCollectorModal
              v-if="
                data.status === 'COLLECTED' && (store.isOwner || user.isAdmin)
              "
              :data="data"
              @bill-collected="getCollectorData()"
            />
          </div>
        </template>
        <template #cell-action-cetak="{ data }"> </template>

        <!-- PAGINATION -->
        <template #pagination>
          <div class="d-flex align-center pt-2">
            <h6 class="fs-14 fw-500">
              {{
                dataCountFormatter(
                  pagination.page,
                  pagination.items,
                  pagination.count,
                  collector_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getCollectorData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
