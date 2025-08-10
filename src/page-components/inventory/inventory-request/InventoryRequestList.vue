<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  requestedStatusFormatter,
  setPaginationLength,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddInventoryRequestModal from "./AddInventoryRequestModal.vue";
import EditInventoryRequestModal from "./EditInventoryRequestModal.vue";
import { requested_status_options } from "@/modules/options";
import { stateManagement } from "@/store";

// INTERFACE

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  status: null,
  id_engineer: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  status: requested_status_options,
  engineer: [],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const inventory_request_table_data = ref({
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
      title: "JUMLAH DIMINTA",
      key: "quantity",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "NAMA TEKNISI",
      key: "engineer",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "150px",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "150px",
    },
    {
      title: "TANGGAL DIAJUKAN",
      key: "created_at",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "150px",
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
const getUserOptions = () => {
  axiosIns.get("/options/user?role=5").then((res) => {
    options.value.engineer = res?.data?.user_options || [];
  });
};
const getInventoryRequestData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    ...(store.isEngineer ? { id_engineer: store.getUser._id } : {}),
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.status ? { status: filter_data.value.status } : {}),
    ...(filter_data.value.id_engineer
      ? { id_engineer: filter_data.value.id_engineer }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`inventory/requested?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      inventory_request_table_data.value.body =
        res.data.inventory_requested_data || [];
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
const updateStatusInventoryRequest = async (
  id: string,
  name: string,
  status: string
) => {
  const is_accepted = status == "ACCEPTED" ? true : false;
  const is_confirmed = await confirmAction(
    `${is_accepted ? "Setujui" : "Tolak"} Pengajuan Barang? `,
    `Pengajuan ${name} akan ${is_accepted ? "disetujui" : "ditolak"}`,
    `Ya, ${is_accepted ? "Setujui" : "Tolak"}!`
  );
  if (is_confirmed) {
    axiosIns
      .put(`inventory/requested/update-status/${id}`, {
        data: {
          status: status,
        },
      })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Pengajuan Barang Telah ${is_accepted ? "Disetujui" : "Ditolak"}`
        );
        getInventoryRequestData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
const deleteInventoryRequest = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pengajuan Barang?",
    `${name} akan dihapus dari daftar pengajuan barang`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`inventory/requested/delete/${id}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          "Pengajuan Barang Telah Dihapus"
        );
        getInventoryRequestData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
// LIFECYCLE HOOKS
onMounted(() => {
  getInventoryRequestData();
  getUserOptions();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-git-pull-request" />
      </template>
      <template #title> Daftar Pengajuan Barang </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getInventoryRequestData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInventoryRequestData(true)"
        />
        <VSpacer />
        <AddInventoryRequestModal
          v-if="store.isEngineer"
          :category_options="[]"
          @inventory-request-added="
            showActionResult(), getInventoryRequestData()
          "
        />
        <div v-if="store.isOwnerAdmin" class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.id_engineer"
            :items="options.engineer"
            item-title="title"
            item-value="value"
            label="Teknisi"
            clearable
            @update:model-value="getInventoryRequestData()"
          />
        </div>
        <div class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.status"
            :items="options.status"
            item-title="title"
            item-value="value"
            label="Status"
            clearable
            @update:model-value="getInventoryRequestData()"
          />
        </div>
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getInventoryRequestData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="inventory_request_table_data.headers"
        :body="inventory_request_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-quantity="{ data }">
          <strong>{{ data?.quantity || 0 }}</strong>
        </template>
        <template #cell-status="{ data }">
          <VChip :color="requestedStatusFormatter(data.status).color">
            {{ requestedStatusFormatter(data.status).title }}
          </VChip>
        </template>
        <template #cell-created_at="{ data }">
          <VChip>
            {{
              data?.created_at
                ? dateFormatterID(data.created_at, true, true)
                : "-"
            }}
          </VChip>
        </template>
        <template #cell-action="{ data, index }">
          <div
            v-if="data.status === 'PENDING' || store.isOwnerAdmin"
            class="d-flex gap-1 flex-nowrap py-1 justify-center"
          >
            <VBtn
              v-if="store.isOwnerAdmin && data.status == 'PENDING'"
              size="35"
              color="success"
              @click="
                updateStatusInventoryRequest(data._id, data.name, 'ACCEPTED')
              "
            >
              <VIcon icon="tabler-checks" />
              <VTooltip activator="parent"> Setujui </VTooltip>
            </VBtn>
            <VBtn
              v-if="store.isOwnerAdmin && data.status == 'PENDING'"
              size="35"
              color="error"
              @click="
                updateStatusInventoryRequest(data._id, data.name, 'REJECTED')
              "
            >
              <VIcon icon="tabler-x" />
              <VTooltip activator="parent"> Tolak </VTooltip>
            </VBtn>
            <EditInventoryRequestModal
              :data="data"
              @inventory-request-updated="getInventoryRequestData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteInventoryRequest(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
          </div>
          <div v-else>
            <VChip color="warning">Data Tidak Dapat Diubah</VChip>
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
                  inventory_request_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getInventoryRequestData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
