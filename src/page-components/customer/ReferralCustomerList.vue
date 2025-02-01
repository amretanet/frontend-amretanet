<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  customerStatusFormatter,
  dateFormatterID,
  setPaginationLength,
  dataCountFormatter,
} from "@/modules";
import { customer_status_options } from "@/modules/options";
import DataTable from "@/page-components/DataTable.vue";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import axios from "axios";
import { Marker } from "vue3-google-map";
import AddReferralCustomerModal from "./AddReferralCustomerModal.vue";

// VARIABLES
const store = stateManagement();
const is_show_maps = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_maps_loading = ref(true);
const filter_data = ref({
  key: "",
  status: null,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
});
const cancel_request_token = ref<any>(null);
const cancel_maps_request_token = ref<any>(null);
const customer_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    {
      title: "NAMA",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
      width: "25%",
    },
    {
      title: "NOMOR LAYANAN",
      key: "service_number",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "NOMOR TELEPON",
      key: "phone_number",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "ALAMAT",
      key: "location",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TANGGAL DAFTAR",
      key: "created_at",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "REFERRAL",
      key: "referral",
      th_class: "text-center",
      td_class: "text-center",
    },
  ],
  body: [],
});
const customer_maps_data = ref<any[]>([]);
const options = ref({
  status: customer_status_options,
});

// FUNCTION
const getCustomerData = (
  is_refresh: boolean = false,
  is_reset_page = false
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
    referral: store.getUser.referral,
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.status != null
      ? { status: filter_data.value.status }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`customer?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      customer_table_data.value.body = res.data.customer_data || [];
      customer_maps_data.value = res.data.customer_maps_data || [];
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
const getCustomerMapsData = () => {
  is_maps_loading.value = true;
  if (cancel_maps_request_token.value) {
    cancel_maps_request_token.value.cancel();
  }
  cancel_maps_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    referral: store.getUser.referral,
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.status != null
      ? { status: filter_data.value.status }
      : {}),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`customer/maps?${query}`, {
      cancelToken: cancel_maps_request_token.value.token,
    })
    .then((res) => {
      cancel_maps_request_token.value = null;
      customer_maps_data.value = res.data.customer_maps_data || [];
    })
    .catch((err) => {
      if (err.code !== "ERR_CANCELED") {
        cancel_maps_request_token.value = null;
      }
    })
    .finally(() => {
      if (!cancel_maps_request_token.value) {
        is_maps_loading.value = false;
      }
    });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCustomerData();
  getCustomerMapsData();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-user-square-rounded" />
      </template>
      <template #title> Daftar Pelanggan Referral </template>
      <template #append>
        <VSwitch v-model="is_show_maps">
          <template #label>
            <span class="fs-14"> Lihat Maps </span>
          </template>
        </VSwitch>
      </template>
    </VCardItem>
    <VCardText v-if="is_show_maps">
      <SkeletonLoader v-if="is_maps_loading" height="500px" />
      <GoogleMaps v-else :zoom="15">
        <template #marker>
          <Marker
            v-for="(item, index) in customer_maps_data"
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
            @update:model-value="getCustomerData(false, true)"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCustomerData(true), getCustomerMapsData()"
        />
        <VSpacer />
        <AddReferralCustomerModal
          @customer-added="
            (pagination.page = 1), getCustomerData(), getCustomerMapsData()
          "
        />
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            label="Status"
            :items="options.status"
            item-title="title"
            item-value="value"
            clearable
            @update:model-value="
              getCustomerData(false, true), getCustomerMapsData()
            "
          />
        </div>
        <form class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="
              getCustomerData(false, true), getCustomerMapsData()
            "
          />
        </form>
      </div>
    </VCardText>
    <div v-if="!is_show_maps">
      <DataTable
        height="65vh"
        :headers="customer_table_data.headers"
        :body="customer_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-name="{ data }">
          {{ data.name }}
        </template>
        <template #cell-created_at="{ data }">
          <VChip variant="outlined">
            {{ dateFormatterID(data.created_at, false) }}
          </VChip>
        </template>
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.service_number }}
          </VChip>
        </template>
        <template #cell-phone_number="{ data }">
          <VChip
            variant="outlined"
            color="success"
            prepend-icon="tabler-brand-whatsapp"
          >
            0{{ data.phone_number }}
          </VChip>
        </template>
        <template #cell-location="{ data }">
          <div style="min-width: 10rem">
            {{ data?.location?.address || "-" }}
          </div>
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="customerStatusFormatter(data.status).color"
          >
            {{ customerStatusFormatter(data.status).title }}
          </VChip>
        </template>
        <template #cell-referral="{ data }">
          <VChip variant="outlined" :color="data.referral ? 'success' : 'dark'">
            {{ data.referral ? `${data.referral}` : "Tidak Ada" }}
          </VChip>
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
                  customer_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getCustomerData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
