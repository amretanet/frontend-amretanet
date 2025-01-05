<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  monthFormatter,
  paymentStatusFormatter,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";
import AddSalaryModal from "./AddSalaryModal.vue";
import EditSalaryModal from "./EditSalaryModal.vue";
import { month_options, year_options } from "@/modules/options";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  id_user: null,
  month: null,
  year: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  user: [],
  month: month_options,
  year: year_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const salary_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    {
      title: "NAMA",
      key: "name",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PERIODE",
      key: "period",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "GAJI DITERIMA",
      key: "net_salary",
      th_class: "text-left",
      td_class: "text-left",
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

// FUNCTION
const getSalaryData = (
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
    ...(filter_data.value.id_user
      ? { id_user: filter_data.value.id_user }
      : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`salary?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      salary_table_data.value.body = res?.data?.salary_data || [];
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
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res?.data?.user_options || [];
  });
};
const deleteSalaryData = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Gaji Karyawan?",
    `Gaji Karyawan yang dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`salary/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Gaji Karyawan Telah Dihapus");
        getSalaryData();
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
  getSalaryData();
  getUserOptions();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="mdi-account-cash-outline" />
      </template>
      <template #title> Daftar Gaji Karyawan </template>
    </VCardItem>
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getSalaryData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getSalaryData(false, true)"
        />
        <VSpacer />
        <!-- ADD INCOME BUTTON -->
        <AddSalaryModal @salary-added="getSalaryData(true)" />
        <!-- MONTH FILTER -->
        <div class="wm-100" style="min-width: 8rem">
          <VAutocomplete
            v-model="filter_data.month"
            label="Bulan"
            :items="options.month"
            clearable
            @update:model-value="getSalaryData(true)"
          />
        </div>
        <!-- YEAR FILTER -->
        <div class="wm-100" style="min-width: 8rem">
          <VAutocomplete
            v-model="filter_data.year"
            label="Tahun"
            :items="options.year"
            clearable
            @update:model-value="getSalaryData(true)"
          />
        </div>
        <!-- RECEIVER FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.id_user"
            label="Karyawan"
            :items="options.user.filter((el:any)=>el.role!==99)"
            clearable
            @update:model-value="getSalaryData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getSalaryData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="salary_table_data.headers"
        :body="salary_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          {{ data?.employee?.name || "" }}
        </template>
        <template #cell-period="{ data }">
          {{ monthFormatter(parseInt(data.period.month)) || "" }}
          {{ data.period.year || "" }}
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="paymentStatusFormatter(data.status).color"
            class="font-weight-black"
          >
            {{ paymentStatusFormatter(data.status).title || "" }}
          </VChip>
        </template>
        <template #cell-net_salary="{ data }">
          Rp{{ thousandSeparator(data?.net_salary || 0) }}
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditSalaryModal :data="data" @salary-updated="getSalaryData()" />
            <VBtn size="35" color="error" @click="deleteSalaryData(data._id)">
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
                  salary_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getSalaryData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
