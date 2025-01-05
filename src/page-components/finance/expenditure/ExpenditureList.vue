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
import AddExpenditureModal from "./AddExpenditureModal.vue";
import EditExpenditureModal from "./EditExpenditureModal.vue";
import DateRangePicker from "@/page-components/DateRangePicker.vue";
import moment from "moment";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  from_date: moment().startOf("month").format("YYYY-MM-DD 00:00:00"),
  to_date: moment().format("YYYY-MM-DD 23:59:59"),
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const expenditure_table_data = ref({
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
const expenditure_count = ref(0);

// FUNCTION
const getExpenditureData = (
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
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
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
    .get(`expenditure?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      expenditure_table_data.value.body = res?.data?.expenditure_data || [];
      pagination.value.count = res?.data?.pagination_info?.count || 0;
      getExpenditureStats();
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
const getExpenditureStats = () => {
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    from_date: filter_data.value.from_date,
    to_date: filter_data.value.to_date,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`expenditure/stats?${query}`)
    .then((res) => {
      expenditure_count.value = res?.data?.expenditure_count || 0;
    })
    .catch(() => {
      expenditure_count.value = 0;
    });
};
const deleteExpenditureData = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pengeluaran?",
    `Pengeluaran yang dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`expenditure/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pengeluaran Telah Dihapus");
        getExpenditureData();
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
  getExpenditureData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="mdi-bank-transfer-out" />
      </template>
      <template #title> Daftar Pengeluaran </template>
      <template #append>
        <VChip color="primary" variant="flat" class="font-weight-black">
          Total Pengeluaran : Rp{{ thousandSeparator(expenditure_count) }}
        </VChip>
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
            @update:model-value="getExpenditureData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getExpenditureData(false, true)"
        />
        <VSpacer />
        <!-- ADD EXPENDITURE BUTTON -->
        <AddExpenditureModal @expenditure-added="getExpenditureData(true)" />
        <!-- DATE RANGE FILTER -->
        <div style="width: 20rem">
          <DateRangePicker
            v-model:from="filter_data.from_date"
            v-model:to="filter_data.to_date"
            @date-change="getExpenditureData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getExpenditureData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="expenditure_table_data.headers"
        :body="expenditure_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-date="{ data }">
          <VChip>
            {{ dateFormatterID(data.date, true, true) }}
          </VChip>
        </template>
        <template #cell-nominal="{ data }">
          Rp{{ thousandSeparator(data?.nominal || 0) }}
        </template>
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
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditExpenditureModal
              :data="data"
              @expenditure-updated="getExpenditureData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteExpenditureData(data._id)"
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
                  expenditure_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getExpenditureData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
