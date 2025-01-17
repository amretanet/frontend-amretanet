<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  paymentStatusFormatter,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import {
  payment_status_options,
  month_options,
  year_options,
} from "@/modules/options";
import { stateManagement } from "@/store";
import InvoiceDetailModal from "./InvoiceDetailModal.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import EditInvoiceModal from "./EditInvoiceModal.vue";
import PayOffInvoiceModal from "./PayOffInvoiceModal.vue";
import RequestPaymentModal from "./RequestPaymentModal.vue";

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
const options = ref({
  status: payment_status_options,
  month: month_options,
  year: year_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const invoice_table_data = ref({
  headers: [
    ...(!store.isCustomer
      ? [
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
        ]
      : [
          {
            title: "NO",
            key: "no",
            th_class: "text-center",
            td_class: "text-center",
          },
        ]),
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
const getInvoiceData = (
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
    ...(store.isCustomer ? { id_customer: store.getUser.id_customer } : {}),
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    ...(filter_data.value.status ? { status: filter_data.value.status } : {}),
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
    "Hapus Tagihan?",
    `Invoice ${name} akan dihapus dari daftar tagihan pelanggan`,
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
      .delete(`invoice/delete?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Invoice Telah Dihapus");
        getInvoiceData();
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
const activateCustomer = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Aktifkan Pengguna?",
    `${name} akan diaktifkan ulang`,
    "Ya, Aktifkan!"
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
      .get(`invoice/activate-customer?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pengguna Telah Diaktifkan!");
        getInvoiceData();
      })
      .catch(() => {
        showActionResult(undefined, "error", "Gagal Aktifkan Pengguna!");
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};
const isolirCustomer = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Isolir Pengguna?",
    `${name} akan diisolir`,
    "Ya, Isolir!"
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
      .get(`invoice/isolir-customer?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pengguna Telah Diisolir!");
        getInvoiceData();
      })
      .catch(() => {
        showActionResult(undefined, "error", "Gagal Isolir Pengguna!");
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};
const sendReminderMessage = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Kirim Whatsapp Pengingat?",
    `Pesan whatsapp pengingat kepada ${name} akan dikirimkan`,
    "Ya, Kirimkan!"
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
      .get(`invoice/whatsapp-reminder?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Pesan Whatsapp Pengingat Telah Dikirimkan!"
        );
      })
      .catch(() => {
        showActionResult(
          undefined,
          "error",
          "Pesan Whatsapp Gagal Dikirimkan!"
        );
      })
      .finally(() => {
        store.loadingHandler(false);
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
const deleteSelectedInvoice = async () => {
  const is_confirmed = await confirmAction(
    "Hapus Tagihan Terpilih?",
    `Invoice yang dipilih akan dihapus dari daftar tagihan pelanggan`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(checked_invoice_data.value.join(",")),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .delete(`invoice/delete?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Invoice Telah Dihapus");
        getInvoiceData();
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
const printSelectedInvoice = (type: string) => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  const params: IObjectKeys = {
    id: btoa(checked_invoice_data.value.join(",")),
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
const sendReminderMessageSelectedInvoice = async () => {
  const is_confirmed = await confirmAction(
    "Kirim Whatsapp Pengingat?",
    `Pesan whatsapp pengingat kepada ${name} akan dikirimkan`,
    "Ya, Kirimkan!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(checked_invoice_data.value.join(",")),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .get(`invoice/whatsapp-reminder?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Pesan Whatsapp Pengingat Telah Dikirimkan!"
        );
      })
      .catch(() => {
        showActionResult(
          undefined,
          "error",
          "Pesan Whatsapp Gagal Dikirimkan!"
        );
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};
const updateStatusSelectedInvoice = async (status: string) => {
  const formatted_status = paymentStatusFormatter(status).title;
  const is_confirmed = await confirmAction(
    "Ubah Status Invoice Terpilih?",
    `Status invoice yang dipilih akan diubah menjadi ${formatted_status}`,
    "Ya, Ubah!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    const params: IObjectKeys = {
      id: btoa(checked_invoice_data.value.join(",")),
      description: "Pembayaran Tagihan Pelanggan",
      status: status,
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .put(`invoice/update/status?${query}`)
      .then(() => {
        showActionResult(undefined, undefined, "Status Invoice Telah Diubah");
        getInvoiceData();
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
const removeQueryPath = (key: string) => {
  const current_query = { ...router.currentRoute.value.query };
  if (key in current_query) {
    delete current_query[key];
    router.replace({ query: current_query });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getInvoiceData();
});
watch(checked_invoice_data, () => {
  checkItemChecked();
});
watch(
  () => routes.query,
  () => {
    if (routes.query.status) {
      filter_data.value.status = routes.query.status;
      getInvoiceData();
    }
  }
);
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-file-invoice" />
      </template>
      <template #title>
        {{
          store.isCustomer ? "Daftar Tagihan Saya" : "Daftar Tagihan Pelanggan"
        }}
      </template>
      <template #append>
        <ProcessButton
          v-if="!store.isCustomer"
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
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getInvoiceData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInvoiceData(false, true)"
        />
        <!-- BULK ACTION BUTTON -->
        <VBtn
          v-if="!store.isCustomer"
          size="40"
          prepend-icon="mdi-dots-vertical"
          :disabled="checked_invoice_data.length === 0"
        >
          <VMenu activator="parent">
            <VCard>
              <VCardText class="px-2 py-2 d-flex flex-column gap-2">
                <!-- UNPAID BUTTON -->
                <VBtn
                  size="small"
                  color="error"
                  prepend-icon="tabler-x"
                  @click="updateStatusSelectedInvoice('UNPAID')"
                >
                  Tandai Belum Bayar
                </VBtn>
                <!-- PAID BUTTON -->
                <VBtn
                  size="small"
                  color="success"
                  prepend-icon="tabler-checks"
                  @click="updateStatusSelectedInvoice('PAID')"
                >
                  Tandai Sudah Bayar
                </VBtn>
                <!-- PRINT BUTTON -->
                <VBtn
                  size="small"
                  color="warning"
                  block
                  prepend-icon="mdi-printer"
                >
                  Cetak Tagihan
                  <VMenu activator="parent">
                    <VCard>
                      <VCardText class="d-flex gap-2 px-2 py-2">
                        <VBtn
                          size="small"
                          variant="outlined"
                          color="dark"
                          prepend-icon="mdi-file"
                          @click="printSelectedInvoice('A4')"
                        >
                          A4
                        </VBtn>
                        <VBtn
                          size="small"
                          variant="outlined"
                          color="dark"
                          prepend-icon="mdi-file"
                          @click="printSelectedInvoice('THERMAL')"
                        >
                          THERMAL
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </VMenu>
                </VBtn>
                <VBtn
                  size="small"
                  color="success"
                  prepend-icon="mdi-whatsapp"
                  @click="sendReminderMessageSelectedInvoice()"
                >
                  Ingatkan Pelanggan
                </VBtn>
                <!-- DELETE BUTTON -->
                <VBtn
                  size="small"
                  color="error"
                  prepend-icon="tabler-trash"
                  @click="deleteSelectedInvoice()"
                >
                  Hapus
                </VBtn>
              </VCardText>
            </VCard>
          </VMenu>
        </VBtn>
        <VSpacer />
        <!-- MONTH FILTER -->
        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.month"
            label="Bulan"
            :items="options.month"
            clearable
            @update:model-value="getInvoiceData(true)"
          />
        </div>
        <!-- YEAR FILTER -->
        <div class="wm-100" style="min-width: 7rem">
          <VSelect
            v-model="filter_data.year"
            label="Tahun"
            :items="options.year"
            clearable
            @update:model-value="getInvoiceData(true)"
          />
        </div>
        <!-- STATUS FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            label="Status"
            :items="options.status"
            clearable
            @update:model-value="
              removeQueryPath('status'), getInvoiceData(true)
            "
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getInvoiceData(true)"
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
        <!-- CUSTOM ACTION -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <!-- REQUEST PAYMENT -->
            <RequestPaymentModal
              v-if="store.isCustomer && data.status !== 'PAID'"
              :data="data"
              @payment-requested="getInvoiceData()"
            />
            <!-- DETAIL BUTTON -->
            <InvoiceDetailModal
              :data="data"
              @invoice-confirmed="getInvoiceData()"
            />
            <!-- EDIT BUTTON -->
            <EditInvoiceModal
              v-if="!store.isCustomer"
              :data="data"
              @invoice-updated="getInvoiceData()"
            />
            <!-- DELETE BUTTON -->
            <VBtn
              v-if="!store.isCustomer"
              size="35"
              color="error"
              @click="deleteInvoice(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
            <!-- PRINT BUTTON -->
            <VBtn
              v-if="store.isCustomer"
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
                      @click="printInvoice(data._id, 'A4')"
                    >
                      A4
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
            <!-- MORE BUTTON -->
            <VBtn v-else size="35" color="primary">
              <VIcon icon="mdi-dots-vertical" />
              <VTooltip activator="parent"> Lainnya </VTooltip>
              <VMenu activator="parent" :close-on-content-click="false">
                <VCard>
                  <VCardText class="d-flex flex-column gap-2 px-2 py-2">
                    <!-- PRINT BUTTON -->
                    <VBtn
                      size="small"
                      color="warning"
                      block
                      prepend-icon="mdi-printer"
                    >
                      Cetak Tagihan
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
                              @click="printInvoice(data._id, 'THERMAL')"
                            >
                              THERMAL
                            </VBtn>
                          </VCardText>
                        </VCard>
                      </VMenu>
                    </VBtn>
                    <!-- PAY OFF BUTTON -->
                    <PayOffInvoiceModal
                      v-if="data?.status == 'UNPAID'"
                      :data="data"
                      @invoice-pay-off="getInvoiceData()"
                    />
                    <!-- REMINDER BUTTON -->
                    <VBtn
                      v-if="data?.status === 'UNPAID'"
                      size="small"
                      color="success"
                      block
                      prepend-icon="mdi-whatsapp"
                      @click="sendReminderMessage(data._id, data.name)"
                    >
                      Ingatkan Pelanggan
                    </VBtn>
                    <!-- ACTIVATE BUTTON -->
                    <VBtn
                      v-if="data?.customer?.status !== 1"
                      size="small"
                      color="primary"
                      block
                      prepend-icon="tabler-circle-check"
                      @click="activateCustomer(data._id, data.name)"
                    >
                      Aktifkan
                    </VBtn>
                    <!-- ISOLIR BUTTON -->
                    <VBtn
                      v-if="data?.customer?.status === 1"
                      size="small"
                      color="secondary"
                      block
                      prepend-icon="tabler-circle-half-vertical"
                      @click="isolirCustomer(data._id, data.name)"
                    >
                      Isolir
                    </VBtn>
                  </VCardText>
                </VCard>
              </VMenu>
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
