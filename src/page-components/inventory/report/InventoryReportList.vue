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
import { month_options, year_options } from "@/modules/options";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  id_category: null,
  type: null,
  month: null,
  year: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  category: [],
  type: [
    { value: "ENTRY", title: "Barang Masuk" },
    { value: "OUT", title: "Barang Keluar" },
  ],
  month: month_options,
  year: year_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const inventory_report_stats_data = ref<any[]>([]);
const inventory_report_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "KATEGORI",
      key: "category",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TIPE TRANSAKSI",
      key: "type",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "JUMLAH BARANG",
      key: "quantity",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "150px",
    },
    {
      title: "KETERANGAN",
      key: "description",
      th_class: "text-left",
      td_class: "text-left ",
      width: "20%",
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
const getCategoryOptions = () => {
  axiosIns
    .get("/options/category")
    .then((res) => (options.value.category = res?.data.category_options || []));
};
const getInventoryReportData = (is_refresh: boolean = false) => {
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
    ...(filter_data.value.id_category
      ? { id_category: filter_data.value.id_category }
      : {}),
    ...(filter_data.value.type ? { type: filter_data.value.type } : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`inventory/report?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      inventory_report_table_data.value.body =
        res.data.inventory_report_data || [];
      pagination.value.count = res.data.pagination_info.count || 0;
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
const getInventoryReportStatsData = (is_refresh: boolean = false) => {
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.id_category
      ? { id_category: filter_data.value.id_category }
      : {}),
    ...(filter_data.value.type ? { type: filter_data.value.type } : {}),
    ...(filter_data.value.month ? { month: filter_data.value.month } : {}),
    ...(filter_data.value.year ? { year: filter_data.value.year } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`inventory/report/stats?${query}`)
    .then((res) => {
      inventory_report_stats_data.value =
        res?.data?.inventory_report_stats_data || [];
    })
    .catch(() => {
      inventory_report_stats_data.value = [];
    });
};
const deleteInventoryReport = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Riwayat Transaksi Barang?",
    `${name} akan dihapus dari daftar riwayat transaksi barang`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`inventory/report/delete/${id}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Riwayat Transaksi Barang Telah Dihapus"
        );
        getInventoryReportData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
// LIFECYCLE HOOKS
onMounted(() => {
  getInventoryReportStatsData();
  getInventoryReportData();
  getCategoryOptions();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-device-airpods-case" />
      </template>
      <template #title> Daftar Laporan Transaksi Barang </template>
    </VCardItem>
    <VCardText class="pb-2">
      <VCard
        v-if="inventory_report_stats_data.length > 0"
        variant="outlined"
        color="secondary"
        class="my-4"
      >
        <VCardText>
          <div class="d-flex align-center gap-3 flex-wrap">
            <VCard
              v-for="item in inventory_report_stats_data"
              variant="tonal"
              color="primary"
            >
              <VCardText>
                <div>
                  <strong class="fs-18">{{ item?._id || "-" }}</strong>
                </div>
                <hr class="mt-2" />
                <div class="mt-2">
                  <div class="text-error">
                    <VIcon icon="tabler-arrow-up" /> Barang Keluar :
                    {{ thousandSeparator(item?.out || 0) }}
                  </div>
                  <div class="text-success">
                    <VIcon icon="tabler-arrow-down" /> Barang Masuk :
                    {{ thousandSeparator(item?.entry || 0) }}
                  </div>
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCardText>
      </VCard>
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInventoryReportData(true), getInventoryReportStatsData()"
        />
        <VSpacer />
        <!-- MONTH FILTER -->
        <div class="wm-100" style="min-width: 8rem">
          <VAutocomplete
            v-model="filter_data.month"
            label="Bulan"
            :items="options.month"
            clearable
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
        <!-- YEAR FILTER -->
        <div class="wm-100" style="min-width: 8rem">
          <VAutocomplete
            v-model="filter_data.year"
            label="Tahun"
            :items="options.year"
            clearable
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
        <div class="wm-100" style="min-width: 11rem">
          <VSelect
            v-model="filter_data.type"
            :items="options.type"
            label="Tipe Transaksi"
            clearable
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
        <div class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.id_category"
            :items="options.category"
            item-title="name"
            item-value="_id"
            label="Kategori"
            clearable
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="
              getInventoryReportData(), getInventoryReportStatsData()
            "
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="inventory_report_table_data.headers"
        :body="inventory_report_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-quantity="{ data }">
          <strong>{{ data?.quantity || 0 }}</strong>
        </template>
        <template #cell-type="{ data }">
          <VChip v-if="data?.type == 'OUT'" color="error">
            Barang Keluar
          </VChip>
          <VChip v-else color="success"> Barang Masuk </VChip>
        </template>
        <template #cell-description="{ data }">
          <div class="py-2">
            <div class="text-no-wrap">
              <strong>Dibuat Pada:</strong>
              {{ data?.created_at ? dateFormatterID(data.created_at) : "" }}
            </div>
            <div><strong>Dibuat Oleh:</strong> {{ data?.created_by }}</div>
            <div>
              <strong>Deskripsi:</strong> {{ data?.description || "-" }}
            </div>
          </div>
        </template>
        <template #cell-action="{ data, index }">
          <div class="d-flex gap-1 flex-nowrap py-1 justify-center">
            <VBtn
              size="35"
              color="error"
              @click="deleteInventoryReport(data._id, data.name)"
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
                  inventory_report_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getInventoryReportData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
