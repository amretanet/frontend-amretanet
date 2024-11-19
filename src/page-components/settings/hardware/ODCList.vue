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
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddODCModal from "./odc/AddODCModal.vue";
import EditODCModal from "./odc/EditODCModal.vue";
import { Marker } from "vue3-google-map";

// VARIABLES
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
});
const is_show_maps = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const odc_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "NAMA/KODE ODC",
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
const odc_maps_data = ref<any[]>([]);

// FUNCTION
const getODCData = (is_refresh: boolean = false) => {
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
    .get(`hardware/odc?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      odc_table_data.value.body = res.data.odc_data || [];
      odc_maps_data.value = res.data.odc_maps_data || [];
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
const deleteODC = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus ODC?",
    `${name} akan dihapus dari daftar ODC`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`hardware/odc/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "ODC Telah Dihapus");
        getODCData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getODCData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-server-2" />
      </template>
      <template #title> Daftar Optical Distribution Cabinet (ODC) </template>
      <template #append>
        <VSwitch v-model="is_show_maps">
          <template #label>
            <span class="fs-14">Lihat Maps</span>
          </template>
        </VSwitch>
      </template>
    </VCardItem>
    <VCardText v-if="is_show_maps">
      <GoogleMaps :zoom="18">
        <template #marker>
          <Marker
            v-for="(item, index) in odc_maps_data"
            :key="index"
            :options="{ position: item }"
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
            @update:model-value="getODCData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getODCData(true)"
        />
        <VSpacer />
        <AddODCModal @odc-added="showActionResult(), getODCData()" />
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getODCData()"
          />
        </div>
      </div>
    </VCardText>
    <div v-if="!is_show_maps">
      <DataTable
        height="30rem"
        :headers="odc_table_data.headers"
        :body="odc_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          <VChip color="primary">
            <strong>{{ data.name || "-" }}</strong>
          </VChip>
        </template>
        <template #cell-address="{ data }">
          {{ data?.location?.address || "-" }}
        </template>
        <template #cell-port="{ data }">
          <small>PON</small> {{ data.port || 0 }}
        </template>
        <template #cell-damping="{ data }">
          {{ data.damping || 0 }} <small>DB</small>
        </template>
        <template #cell-capacity="{ data }">
          {{ data.capacity || 0 }} <small>Core/Port</small>
        </template>
        <template #cell-available="{ data }">
          {{ data.available || 0 }} <small>Core</small>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditODCModal
              :data="data"
              @odc-updated="showActionResult(), getODCData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteODC(data._id, data.name)"
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
                  odc_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getODCData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
