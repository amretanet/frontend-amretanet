<script setup lang="ts">
import { IObjectKeys, IUsers } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  errorMessage,
  setPaginationLength,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddMikrotikModal from "./mikrotik/AddMikrotikModal.vue";
import EditMikrotikModal from "./mikrotik/EditMikrotikModal.vue";
// VARIABLES
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
const mikrotik_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA/KODE MIKROTIK",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
      width: "15rem",
    },
    {
      title: "IP ADDRESS",
      key: "ip_address",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "PORT",
      key: "api_port",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "USERNAME",
      key: "username",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "AKSI",
      key: "action",
      th_class: "text-center",
      td_class: "text-center",
      width: "150px",
    },
  ],
  body: [] as IUsers[],
});

// FUNCTION
const getMikrotikData = (is_refresh: boolean = false) => {
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
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`hardware/mikrotik?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      mikrotik_table_data.value.body = res.data.mikrotik_data || [];
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
const deleteMikrotik = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Mikrotik?",
    `${name} akan dihapus dari daftar Mikrotik`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`hardware/mikrotik/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Mikrotik Telah Dihapus");
        getMikrotikData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getMikrotikData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-router" />
      </template>
      <template #title> Daftar Mikrotik </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getMikrotikData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getMikrotikData(true)"
        />
        <VSpacer />
        <AddMikrotikModal
          @mikrotik-added="showActionResult(), getMikrotikData()"
        />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getMikrotikData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="30rem"
        :headers="mikrotik_table_data.headers"
        :body="mikrotik_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          <VChip color="warning">
            <strong>{{ data.name || "-" }}</strong>
          </VChip>
        </template>
        <template #cell-status="{ data }">
          <VChip variant="outlined" :color="data.status ? 'success' : 'error'">
            {{ data.status ? "Aktif" : "Nonaktif" }}
          </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditMikrotikModal
              :data="data"
              @mikrotik-updated="showActionResult(), getMikrotikData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteMikrotik(data._id, data.name)"
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
                  mikrotik_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getMikrotikData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
