<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  setPaginationLength,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddInventoryModal from "./AddInventoryModal.vue";
import EditInventoryModal from "./EditInventoryModal.vue";
import { stateManagement } from "@/store";

// INTERFACE
interface IProps {
  position: string;
}

// VARIABLES
const store = stateManagement();
const props = defineProps<IProps>();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  id_category: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  category: [],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const inventory_table_data = ref({
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
      title: "STOK",
      key: "quantity",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "150px",
    },
    ...(props.position == "ENGINEER"
      ? [
          {
            title: "TEKNISI",
            key: "pic_name",
            th_class: "text-center",
            td_class: "text-center text-no-wrap",
            width: "150px",
          },
        ]
      : []),
    ...(props.position == "CUSTOMER"
      ? [
          {
            title: "PELANGGAN",
            key: "pic_name",
            th_class: "text-center",
            td_class: "text-center text-no-wrap",
            width: "150px",
          },
        ]
      : []),
    ...(props.position == "WAREHOUSE"
      ? [
          {
            title: "KETERANGAN",
            key: "description",
            th_class: "text-left",
            td_class: "text-left ",
            width: "35%",
          },
        ]
      : []),

    ...(store.isOwnerAdmin
      ? [
          {
            title: "AKSI",
            key: "action",
            th_class: "text-center",
            td_class: "text-center",
            width: "150px",
          },
        ]
      : []),
  ],
  body: [],
});

// FUNCTION
const getCategoryOptions = () => {
  axiosIns
    .get("/options/category")
    .then((res) => (options.value.category = res?.data.category_options || []));
};
const getInventoryData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    position: props.position,
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.id_category
      ? { id_category: filter_data.value.id_category }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`inventory?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      inventory_table_data.value.body = res.data.inventory_data || [];
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
const deleteInventory = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Barang?",
    `${name} akan dihapus dari daftar barang`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`inventory/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Barang Telah Dihapus");
        getInventoryData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
// LIFECYCLE HOOKS
onMounted(() => {
  getInventoryData();
  getCategoryOptions();
});
watch(props, () => {
  getInventoryData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-device-airpods-case" />
      </template>
      <template #title> Daftar Barang </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getInventoryData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInventoryData(true)"
        />
        <VSpacer />
        <AddInventoryModal
          v-if="store.isOwnerAdmin"
          :category_options="options.category"
          @inventory-added="showActionResult(), getInventoryData()"
        />
        <div class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.id_category"
            :items="options.category"
            item-title="name"
            item-value="_id"
            label="Kategori"
            clearable
            @update:model-value="getInventoryData()"
          />
        </div>
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getInventoryData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="inventory_table_data.headers"
        :body="inventory_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-quantity="{ data }">
          <strong>{{ data?.quantity || 0 }}</strong>
          <small>{{ " " + data?.unit }}</small>
        </template>
        <template #cell-description="{ data }">
          <div class="py-2">
            <div>
              Terakhir Masuk:
              <VChip color="success">
                {{
                  data?.last_entry
                    ? dateFormatterID(data?.last_entry, true, true)
                    : "-"
                }}
              </VChip>
            </div>
            <div class="mt-2">
              Terakhir Keluar:
              <VChip color="error">
                {{
                  data?.last_out
                    ? dateFormatterID(data?.last_out, true, true)
                    : "-"
                }}
              </VChip>
            </div>
            <div class="mt-3">Deskripsi: {{ data?.description || "-" }}</div>
          </div>
        </template>
        <template #cell-action="{ data, index }">
          <div class="d-flex gap-1 flex-nowrap py-1 justify-center">
            <EditInventoryModal
              v-if="props.position == 'WAREHOUSE' || store.isOwnerAdmin"
              :data="data"
              :category_options="options.category"
              @inventory-updated="getInventoryData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteInventory(data._id, data.name)"
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
                  inventory_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getInventoryData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
