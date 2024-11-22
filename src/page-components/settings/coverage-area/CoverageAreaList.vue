<script setup lang="ts">
import { IObjectKeys, IUsers } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  errorMessage,
  roleFormatter,
  setPaginationLength,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddCoverageModal from "./AddCoverageModal.vue";
import EditCoverageModal from "./EditCoverageModal.vue";
import { stateManagement } from "@/store";
import { Marker } from "vue3-google-map";

// VARIABLES
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_show_maps = ref(false);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const coverage_area_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA/KODE AREA",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "ALAMAT",
      key: "address",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "KAPASITAS",
      key: "capacity",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "TERSEDIA",
      key: "available",
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
const coverage_area_maps_data = ref<any[]>([]);

// FUNCTION
const getCoverageAreaData = (is_refresh: boolean = false) => {
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
    .get(`coverage-area?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      coverage_area_table_data.value.body = res.data.coverage_area_data || [];
      coverage_area_maps_data.value = res.data.coverage_area_maps_data || [];
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
const deleteCoverageArea = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Area?",
    `${name} akan dihapus dari daftar Cakupan Area`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`coverage-area/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Area Telah Dihapus");
        getCoverageAreaData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
const addressFormatter = (data: any) => {
  const address = `${data.address.street_name}, RT ${data.address.rt} /RW ${data.address.rw}, Desa. ${data.address.village}, Kec. ${data.address.subdistrict}, Kab. ${data.address.regency}, Prov. ${data.address.province} - Indonesia ${data.address.postal_code}`;
  return address;
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCoverageAreaData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-map-star" />
      </template>
      <template #title> Daftar Cakupan Area </template>
      <template #append>
        <VSwitch v-model="is_show_maps">
          <template #label> <span class="fs-14">Lihat Maps</span> </template>
        </VSwitch>
      </template>
    </VCardItem>
    <VCardText v-if="is_show_maps">
      <GoogleMaps :zoom="18">
        <template #marker>
          <Marker
            v-for="(item, index) in coverage_area_maps_data"
            :key="index"
            :options="{
              position: item,
            }"
          />
        </template>
      </GoogleMaps>
    </VCardText>
    <VCardText v-if="!is_show_maps" class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getCoverageAreaData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCoverageAreaData(true)"
        />
        <VSpacer />
        <AddCoverageModal
          @area-added="showActionResult(), getCoverageAreaData()"
        />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getCoverageAreaData()"
          />
        </div>
      </div>
    </VCardText>
    <div v-if="!is_show_maps">
      <DataTable
        height="60vh"
        :headers="coverage_area_table_data.headers"
        :body="coverage_area_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-address="{ data }">
          {{ addressFormatter(data) }}
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditCoverageModal
              :data="data"
              @area-updated="showActionResult(), getCoverageAreaData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteCoverageArea(data._id, data.name)"
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
                  coverage_area_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getCoverageAreaData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
