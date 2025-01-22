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
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddODPModal from "./AddODPModal.vue";
import EditODPModal from "./EditODPModal.vue";
import { Marker } from "vue3-google-map";
import { topology_options } from "@/modules/options";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  topology: null,
});
const is_show_maps = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  topology: topology_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const odp_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA/KODE ODP",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
      width: "15rem",
    },
    {
      title: "TERHUBUNG KE",
      key: "parent_name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
      width: "15rem",
    },
    {
      title: "ALAMAT",
      key: "address",
      th_class: "text-left",
      td_class: "text-left",
      width: "20rem",
    },
    {
      title: "JUMLAH PORT",
      key: "port",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "REDAMAN",
      key: "damping",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
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
const odp_maps_data = ref<any[]>([]);

// FUNCTION
const getODPData = (
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
    ...(filter_data.value.topology
      ? { topology: filter_data.value.topology }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`odp?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      odp_table_data.value.body = res.data.odp_data || [];
      odp_maps_data.value = res.data.odp_maps_data || [];
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
const deleteODP = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus ODP?",
    `${name} akan dihapus dari daftar ODP`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`odp/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "ODP Telah Dihapus");
        getODPData();
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

// LIFECYCLE HOOKS
onMounted(() => {
  getODPData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-rectangular-prism" />
      </template>
      <template #title> Daftar Optical Distribution Point (ODP) </template>
      <template #append>
        <VSwitch v-model="is_show_maps">
          <template #label>
            <span class="fs-14">Lihat Maps</span>
          </template>
        </VSwitch>
      </template>
    </VCardItem>
    <!-- MAPS COMPONENTS -->
    <VCardText v-if="is_show_maps">
      <GoogleMaps :zoom="18">
        <template #marker>
          <Marker
            v-for="(item, index) in odp_maps_data"
            :key="index"
            :options="{
              position: item,
            }"
          />
        </template>
      </GoogleMaps>
    </VCardText>
    <!-- FILTER COMPONENT -->
    <VCardText v-if="!is_show_maps" class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getODPData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getODPData(false, true)"
        />
        <VSpacer />
        <!-- ADD ODP BUTTON -->
        <AddODPModal @odp-added="getODPData(true)" />
        <!-- TOPOLOGY FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.topology"
            :items="options.topology"
            label="Topologi"
            clearable
            @update:model-value="getODPData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getODPData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div v-if="!is_show_maps">
      <DataTable
        height="30rem"
        :headers="odp_table_data.headers"
        :body="odp_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          <VChip color="warning">
            <strong>{{ data.name || "-" }}</strong>
          </VChip>
        </template>
        <template #cell-parent_name="{ data }">
          <VChip color="primary">
            <strong>{{ data.parent_name || "-Tidak Diketahui-" }}</strong>
          </VChip>
        </template>
        <template #cell-address="{ data }">
          {{ data?.location?.address || "-" }}
        </template>
        <template #cell-port="{ data }">
          <VChip variant="outlined"> PON {{ data.port || 0 }} </VChip>
        </template>
        <template #cell-damping="{ data }">
          <VChip variant="outlined"> {{ data.damping || 0 }} DB </VChip>
        </template>
        <template #cell-capacity="{ data }">
          <VChip variant="outlined"> {{ data.capacity || 0 }} Core/Port </VChip>
        </template>
        <template #cell-available="{ data }">
          <VChip variant="outlined"> {{ data.available || 0 }} Core </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditODPModal :data="data" @odp-updated="getODPData()" />
            <VBtn
              size="35"
              color="error"
              @click="deleteODP(data._id, data.name)"
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
                  odp_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getODPData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
