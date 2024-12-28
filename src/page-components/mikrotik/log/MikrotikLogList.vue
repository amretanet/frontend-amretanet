<script setup lang="ts">
import { IObjectKeys } from "@/models";
import { bytesConverter } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const log_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    {
      title: "ID",
      key: ".id",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "WAKTU",
      key: "time",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "TOPIK",
      key: "topics",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PESAN",
      key: "message",
      th_class: "text-left",
      td_class: "text-left",
    },
  ],
  body: [],
});

// FUNCTION
const getLogData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    router: store.getCurrentRouter,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`mikrotik/log?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      log_table_data.value.body = res?.data?.log_data || [];
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
  getLogData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-history" />
      </template>
      <template #title>
        Mikrotik Log <strong>({{ store.getCurrentRouter }})</strong>
      </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- PAGE ITEMS -->
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getLogData(true)"
        />
        <VSpacer />
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
    <!-- DATA TABLE -->
    <div>
      <DataTable
        height="60vh"
        :headers="log_table_data.headers"
        :keyword="filter_data.key"
        :body="log_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- CUSTOM ID -->
        <template #cell-.id="{ data }">
          <VChip variant="outlined" color="primary">
            {{ data[".id"] || "-" }}
          </VChip>
        </template>
        <!-- CUSTOM TIME -->
        <template #cell-time="{ data }">
          <VChip variant="outlined">
            {{ data?.time || "-" }}
          </VChip>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
