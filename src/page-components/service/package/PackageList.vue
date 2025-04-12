<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  errorMessage,
  setPaginationLength,
  showActionResult,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddPackageModal from "@/page-components/service/package/AddPackageModal.vue";
import EditPackageModal from "@/page-components/service/package/EditPackageModal.vue";
import { package_category_options } from "@/modules/options";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  category: null,
});
const options = ref({
  category: package_category_options,
  user: [],
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const package_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA/KODE PAKET",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "KATEGORI",
      key: "category",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "BANDWIDTH",
      key: "bandwidth",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "PROFIL ROUTER",
      key: "router_profile",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "REGULER",
      key: "regular",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "RESELLER",
      key: "reseller",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "BIAYA PASANG",
      key: "instalation_cost",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "DITAMPILKAN",
      key: "is_displayed",
      th_class: "text-center",
      td_class: "text-center",
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
      width: "150px",
    },
  ],
  body: [],
});

// FUNCTION
const getPackageData = (
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
    ...(filter_data.value.category
      ? { category: filter_data.value.category }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`package?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      package_table_data.value.body = res.data.package_data || [];
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
const deletePackage = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Paket?",
    `${name} akan dihapus dari daftar paket`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`package/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Paket Telah Dihapus");
        getPackageData();
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
const getUserOptions = () => {
  const params: IObjectKeys = {
    role: 6, // Mitra
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`options/user?${query}`).then((res) => {
    options.value.user = res?.data?.user_options || [];
  });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getPackageData();
  getUserOptions();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-box" />
      </template>
      <template #title> Daftar Paket </template>
    </VCardItem>
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getPackageData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getPackageData(false, true)"
        />
        <VSpacer />
        <!-- ADD PACKAGE BUTTON -->
        <AddPackageModal
          @package-added="getPackageData(true)"
          :user_options="options.user"
        />
        <!-- CATEGORY FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.category"
            label="Kategori"
            :items="options.category"
            clearable
            @update:model-value="getPackageData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getPackageData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="package_table_data.headers"
        :body="package_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          <div class="py-2">
            <div>{{ data?.name || "-" }}</div>
            <div v-if="data.maximum_device">
              <VChip size="x-small" variant="outlined" color="dark">
                1 - {{ data.maximum_device }} Perangkat
              </VChip>
            </div>
          </div>
        </template>
        <template #cell-bandwidth="{ data }">
          <VChip v-if="data?.bandwidth" variant="outlined" color="primary">
            {{ data?.bandwidth || 0 }} Mbps
          </VChip>
        </template>
        <template #cell-router_profile="{ data }">
          <VChip v-if="data?.router_profile" variant="outlined" color="success">
            {{ data?.router_profile || "-" }}
          </VChip>
        </template>
        <template #cell-regular="{ data }">
          Rp{{ thousandSeparator(data?.price?.regular || 0) }}
        </template>
        <template #cell-reseller="{ data }">
          Rp{{ thousandSeparator(data?.price?.reseller || 0) }}
        </template>
        <template #cell-instalation_cost="{ data }">
          <span v-if="data.instalation_cost">
            Rp{{ thousandSeparator(data?.instalation_cost || 0) }}
          </span>
          <strong v-else> GRATIS </strong>
        </template>
        <template #cell-is_displayed="{ data }">
          <VChip
            variant="outlined"
            :color="data.is_displayed ? 'success' : 'error'"
          >
            {{ data?.is_displayed ? "Ya" : "Tidak" }}
          </VChip>
        </template>
        <template #cell-description="{ data }">
          <div style="min-width: 10rem">
            {{ data?.description || "_" }}
          </div>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditPackageModal
              :data="data"
              :user_options="options.user"
              @package-updated="getPackageData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deletePackage(data._id, data.name)"
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
                  package_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getPackageData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
