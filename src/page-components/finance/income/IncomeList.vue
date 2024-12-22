<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";
import AddIncomeModal from "./AddIncomeModal.vue";
import EditIncomeModal from "./EditIncomeModal.vue";
import DateRangePicker from "@/page-components/DateRangePicker.vue";
import moment from "moment";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  receiver: null,
  from_date: moment().startOf("month").format("YYYY-MM-DD 00:00:00"),
  to_date: moment().format("YYYY-MM-DD 23:59:59"),
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  user: [],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const income_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    {
      title: "TANGGAL",
      key: "date",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "NOMINAL",
      key: "nominal",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "DITERIMA OLEH",
      key: "receiver_name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "DESKRIPSI",
      key: "description",
      th_class: "text-left",
      td_class: "text-left",
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
const income_count = ref(0);

// FUNCTION
const getIncomeData = (is_refresh: boolean = false) => {
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
    ...(filter_data.value.receiver
      ? { receiver: filter_data.value.receiver }
      : {}),
    from_date: filter_data.value.from_date,
    to_date: filter_data.value.to_date,
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`income?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      income_table_data.value.body = res?.data?.income_data || [];
      pagination.value.count = res?.data?.pagination_info?.count || 0;
      getIncomeStats();
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
const getIncomeStats = () => {
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.receiver
      ? { receiver: filter_data.value.receiver }
      : {}),
    from_date: filter_data.value.from_date,
    to_date: filter_data.value.to_date,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`income/stats?${query}`)
    .then((res) => {
      income_count.value = res?.data?.income_count || 0;
    })
    .catch(() => {
      income_count.value = 0;
    });
};
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res?.data?.user_options || [];
  });
};
const deleteIncomeData = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pemasukan?",
    `Pemasukan yang dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`income/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pemasukan Telah Dihapus");
        getIncomeData();
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
  getIncomeData();
  getUserOptions();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="mdi-invoice-text-arrow-left-outline" />
      </template>
      <template #title> Daftar Pemasukan </template>
      <template #append>
        <VChip color="primary" variant="flat" class="font-weight-black">
          Total Pemasukan : Rp{{ thousandSeparator(income_count) }}
        </VChip>
      </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- PAGE ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getIncomeData()"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getIncomeData(true)"
        />
        <VSpacer />
        <!-- ADD INCOME BUTTON -->
        <AddIncomeModal
          @income-added="(pagination.page = 1), getIncomeData()"
        />
        <!-- DATE RANGE FILTER -->
        <div style="width: 20rem">
          <DateRangePicker
            v-model:from="filter_data.from_date"
            v-model:to="filter_data.to_date"
            @date-change="(pagination.page = 1), getIncomeData()"
          />
        </div>
        <!-- RECEIVER FILTER -->
        <div class="wm-100" style="min-width: 12rem">
          <VAutocomplete
            v-model="filter_data.receiver"
            label="Penerima"
            :items="options.user.filter((el:any)=>el.role!==99)"
            clearable
            @update:model-value="(pagination.page = 1), getIncomeData()"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="(pagination.page = 1), getIncomeData()"
          />
        </div>
      </div>
    </VCardText>
    <!-- DATA TABLE -->
    <div>
      <DataTable
        height="60vh"
        :headers="income_table_data.headers"
        :body="income_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- CUSTOM CELL DATE -->
        <template #cell-date="{ data }">
          <VChip>
            {{ dateFormatterID(data.date, true, true) }}
          </VChip>
        </template>
        <!-- CUSTOM NOMINAL -->
        <template #cell-nominal="{ data }">
          Rp.{{ thousandSeparator(data?.nominal || 0) }}
        </template>
        <!-- CUSTOM CELL DECSRIPTION -->
        <template #cell-description="{ data }">
          <div class="py-2">
            <div>
              <span class="font-weight-black">
                {{ data.category }}
                <span class="text-primary font-weight-black">
                  ({{ data.method }})
                </span>
              </span>
            </div>
            <div class="mt-2">
              {{ data?.description || "-" }}
            </div>
          </div>
        </template>
        <!-- CUSTOM ACTION -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <!-- EDIT BUTTON -->
            <EditIncomeModal :data="data" @income-updated="getIncomeData()" />
            <!-- DELETE BUTTON -->
            <VBtn size="35" color="error" @click="deleteIncomeData(data._id)">
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
                  income_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getIncomeData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
