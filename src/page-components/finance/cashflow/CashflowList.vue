<script setup lang="ts">
import { IObjectKeys } from "@/models";
import { dateFormatterID, numberToWords, thousandSeparator } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import moment from "moment";
import DateRangePicker from "@/page-components/DateRangePicker.vue";

// VARIABLES
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  from_date: moment().startOf("year").format("YYYY-MM-DD 00:00:00"),
  to_date: moment().format("YYYY-MM-DD 23:59:59"),
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const cashflow_table_data = ref({
  saldo_count: 0,
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
      td_class: "text-center",
    },
    {
      title: "JENIS",
      key: "type",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "DESKRIPSI",
      key: "description",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "KREDIT",
      key: "credit",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "DEBIT",
      key: "debit",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "SALDO",
      key: "saldo",
      th_class: "text-left",
      td_class: "text-left",
    },
  ],
  body: [],
});

// FUNCTION
const getCashflow = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    from_date: filter_data.value.from_date,
    to_date: filter_data.value.to_date,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`transaction/cashflow?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      cashflow_table_data.value.body = res?.data?.cashflow_data || [];
      cashflow_table_data.value.saldo_count = res?.data?.saldo_count || 0;
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
const printCashflow = () => {
  const domain = import.meta.env.VITE_API_DOMAIN;
  const params: IObjectKeys = {
    from_date: filter_data.value.from_date,
    to_date: filter_data.value.to_date,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const url = `${domain}transaction/cashflow/pdf?${query}`;
  window.open(url);
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCashflow();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-vocabulary" />
      </template>
      <template #title> Rekapitulasi Keuangan </template>
    </VCardItem>
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCashflow(false)"
        />
        <VSpacer />
        <VBtn
          prepend-icon="mdi-printer"
          color="warning"
          size="40"
          @click="printCashflow()"
        >
          <VTooltip activator="parent"> Cetak Rekapitulasi Keuangan </VTooltip>
        </VBtn>
        <!-- DATE RANGE FILTER -->
        <div style="width: 20rem">
          <DateRangePicker
            v-model:from="filter_data.from_date"
            v-model:to="filter_data.to_date"
            @date-change="getCashflow(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="cashflow_table_data.headers"
        :body="cashflow_table_data.body"
        :items="pagination.items"
        :keyword="filter_data.key"
        :is_loading="is_loading"
      >
        <template #cell-type="{ data }">
          <VChip
            v-if="data.type === 'EXPENDITURES'"
            color="error"
            variant="outlined"
            class="font-weight-bold"
          >
            PENGELUARAN
          </VChip>
          <VChip
            v-else
            color="success"
            variant="outlined"
            class="font-weight-bold"
          >
            PEMASUKAN
          </VChip>
        </template>
        <template #cell-date="{ data }">
          <VChip>
            {{ dateFormatterID(data.date, true, true) }}
          </VChip>
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
        <template #cell-credit="{ data }">
          <div class="text-no-wrap">
            <span v-if="data.credit" class="text-success font-weight-bold">
              Rp{{ thousandSeparator(data?.credit || 0) }}
            </span>
            <span v-else> - </span>
          </div>
        </template>
        <template #cell-debit="{ data }">
          <div class="text-no-wrap">
            <span v-if="data.debit" class="text-error font-weight-bold">
              Rp{{ thousandSeparator(data?.debit || 0) }}
            </span>
            <span v-else> - </span>
          </div>
        </template>
        <template #cell-saldo="{ data }">
          <div class="text-no-wrap">
            <span v-if="data.saldo">
              Rp{{ thousandSeparator(data?.saldo || 0) }}
            </span>
            <span v-else> - </span>
          </div>
        </template>
        <!-- CUSTOM FOOTER -->
        <template #footer>
          <tr>
            <td colspan="10">
              <div class="d-flex gap-2 justify-end px-5 pt-3 pb-2">
                <div class="font-weight-bold">Total :</div>
                <div class="font-weight-bold">
                  Rp {{ thousandSeparator(cashflow_table_data.saldo_count) }}
                </div>
              </div>
              <div class="d-flex justify-end px-5 pb-3">
                <div class="fs-14 text-center">
                  ({{ numberToWords(cashflow_table_data.saldo_count) }} Rupiah)
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="10">
              <VDivider></VDivider>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
