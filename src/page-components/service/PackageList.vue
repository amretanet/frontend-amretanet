<script setup lang="ts">
import { IObjectKeys, IUsers } from "@/models";
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
      title: "NAMA",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "BANDWIDTH",
      key: "bandwidth",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
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
      title: "PROFIL MIKROTIK",
      key: "mikrotik_profile",
      th_class: "text-center",
      td_class: "text-center",
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
      title: "KETERANGAN",
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
  body: [] as IUsers[],
});

// FUNCTION
const getPackageData = (is_refresh: boolean = false) => {
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
    axiosIns
      .delete(`package/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Paket Telah Dihapus");
        getPackageData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getPackageData();
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
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getPackageData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getPackageData(true)"
        />
        <VSpacer />
        <AddPackageModal
          @package-added="showActionResult(), getPackageData()"
        />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getPackageData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="package_table_data.headers"
        :body="package_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-bandwidth="{ data }">
          <VChip variant="outlined" color="primary">
            {{ data?.bandwidth || 0 }} Mbps
          </VChip>
        </template>
        <template #cell-regular="{ data }">
          Rp{{ thousandSeparator(data?.price?.regular || 0) }}
        </template>
        <template #cell-reseller="{ data }">
          Rp{{ thousandSeparator(data?.price?.reseller || 0) }}
        </template>
        <template #cell-mikrotik_profile="{ data }">
          <VChip variant="outlined" color="success">
            {{ data?.mikrotik_profile || "-" }}
          </VChip>
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
          {{ data?.description || "_" }}
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditPackageModal
              :data="data"
              @package-updated="showActionResult(), getPackageData()"
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
