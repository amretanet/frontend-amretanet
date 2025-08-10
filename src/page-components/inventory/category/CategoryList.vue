<script setup lang="ts">
import { IObjectKeys } from "@/models";
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
import AddCategoryModal from "./AddCategoryModal.vue";
import EditCategoryModal from "./EditCategoryModal.vue";

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
const category_table_data = ref({
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
      title: "DESKRIPSI",
      key: "description",
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
const getCategoryData = (is_refresh: boolean = false) => {
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
    .get(`categories?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      category_table_data.value.body = res.data.category_data || [];
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
const deleteCategory = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Kategori?",
    `${name} akan dihapus dari daftar kategori barang`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`categories/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Kategori Telah Dihapus");
        getCategoryData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
// LIFECYCLE HOOKS
onMounted(() => {
  getCategoryData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-category" />
      </template>
      <template #title> Daftar Kategori Barang </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getCategoryData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCategoryData(true)"
        />
        <VSpacer />
        <AddCategoryModal
          @category-added="showActionResult(), getCategoryData()"
        />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getCategoryData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="category_table_data.headers"
        :body="category_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-description="{ data }">
          {{ data?.description || "-" }}
        </template>
        <template #cell-action="{ data, index }">
          <div class="d-flex gap-1 flex-nowrap py-1 justify-center">
            <EditCategoryModal
              :data="data"
              @category-updated="getCategoryData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteCategory(data._id, data.name)"
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
                  category_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getCategoryData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
