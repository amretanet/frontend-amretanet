<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  customerStatusFormatter,
  dateFormatterID,
  setPaginationLength,
  dataCountFormatter,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";

// VARIABLES
const is_on_refresh = ref(true);
const is_loading = ref(true);
const filter_data = ref({
  key: "",
  id_odp: null,
  id_router: null,
  status: null,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
});
const cancel_request_token = ref<any>(null);
const customer_table_data = ref({
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
      title: "NO LAYANAN",
      key: "service_number",
      th_class: "text-center",
      td_class: "text-center",
      width: "25%",
    },
    {
      title: "NO TELEPON/WHATSAPP",
      key: "phone_number",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "JATUH TEMPO",
      key: "due_date",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "DIINGATKAN",
      key: "remind_at",
      th_class: "text-center",
      td_class: "text-center",
    },
  ],
  body: [],
});

// FUNCTION
const getReminderData = (
  is_refresh: boolean = false,
  is_reset_page = false
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
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`whatsapp-message/reminder?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      customer_table_data.value.body = res.data.customer_data || [];
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

// LIFECYCLE HOOKS
onMounted(() => {
  getReminderData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-calendar-time" />
      </template>
      <template #title> Daftar Pesan Terjadwal </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getReminderData(false, true)"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getReminderData(true)"
        />
        <VSpacer />
        <form class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getReminderData(false, true)"
          />
        </form>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="65vh"
        :headers="customer_table_data.headers"
        :body="customer_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          {{ data.name }}
        </template>
        <template #cell-created_at="{ data }">
          {{ dateFormatterID(data.created_at, true) }}
        </template>
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined">
            {{ data.service_number }}
          </VChip>
        </template>
        <template #cell-phone_number="{ data }">
          <VChip
            variant="outlined"
            color="success"
            prepend-icon="tabler-brand-whatsapp"
          >
            +62{{ data.phone_number }}
          </VChip>
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="customerStatusFormatter(data.status).color"
          >
            {{ customerStatusFormatter(data.status).type }}
          </VChip>
        </template>
        <template #cell-ppn="{ data }">
          <VChip variant="outlined" :color="data.ppn ? 'success' : 'error'">
            {{ data.ppn ? `Ya` : "Tidak" }}
          </VChip>
        </template>
        <template #cell-due_date="{ data }">
          <VChip variant="outlined" color="dark">
            {{ data.due_date ? `Tanggal ${data.due_date}` : "-" }}
          </VChip>
        </template>
        <template #cell-remind_at="{ data }">
          <VChip variant="outlined" prepend-icon="tabler-send" color="warning">
            {{ data.remind_at ? `Setiap Tanggal ${data.remind_at}` : "-" }}
          </VChip>
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
                  customer_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getReminderData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
