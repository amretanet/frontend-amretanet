<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  customerStatusFormatter,
  dateFormatterID,
  errorMessage,
  showActionResult,
  thousandSeparator,
  setPaginationLength,
  dataCountFormatter,
  whatsappUrlFormatter,
  numberToWords,
} from "@/modules";
import { customer_status_options } from "@/modules/options";
import DataTable from "@/page-components/DataTable.vue";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import axios from "axios";
import { Marker, InfoWindow } from "vue3-google-map";
import CustomerDetailModal from "./CustomerDetailModal.vue";
import CustomerMapInfo from "./CustomerMapInfo.vue";
import SkeletonLoader from "../SkeletonLoader.vue";

// VARIABLES
const store = stateManagement();
const router = useRouter();
const routes = useRoute();
const billing_count = ref(0);
const is_show_maps = ref(false);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_maps_loading = ref(true);
const filter_data = ref({
  key: "",
  id_odp: null,
  id_router: null,
  status: routes.query.status ? parseInt(routes.query.status.toString()) : null,
  referral: routes.query.referral ? routes.query.referral : null,
});
const sorting_data = ref({
  key: "service_number",
  direction: "asc",
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
});
const cancel_request_token = ref<any>(null);
const cancel_maps_request_token = ref<any>(null);
const marker_info_index = ref(null);
const customer_table_data = ref({
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
      width: "25%",
    },
    {
      title: "NOMOR LAYANAN",
      key: "service_number",
      th_class: "text-center",
      td_class: "text-center",
      width: "25%",
    },
    {
      title: "NAMA/KODE ODP",
      key: "odp_name",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "25%",
    },
    {
      title: "NOMOR TELEPON",
      key: "phone_number",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "PPN",
      key: "ppn",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TANGGAL DAFTAR",
      key: "registered_at",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "25%",
    },
    {
      title: "JATUH TEMPO",
      key: "due_date",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TAGIHAN",
      key: "billing",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "REFERRAL",
      key: "referral",
      th_class: "text-center",
      td_class: "text-center",
      width: "25%",
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
const customer_maps_data = ref<any[]>([]);
const options = ref({
  status: customer_status_options,
  odp: [],
  router: [],
  user: [],
  sorting_key: [
    {
      title: "Nama",
      value: "name",
    },
    {
      title: "Nomor Layanan",
      value: "service_number",
    },
    {
      title: "Kode Unik",
      value: "unique_code",
    },
    {
      title: "Tanggal Daftar",
      value: "registered_at",
    },
    {
      title: "Jatuh Tempo",
      value: "due_date",
    },
    {
      title: "Nama ODP",
      value: "odp_name",
    },
  ],
});

// FUNCTION
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res?.data?.user_options || [];
  });
};
const getRouterOptions = () => {
  axiosIns.get("options/router").then((res) => {
    options.value.router = res?.data?.router_options || [];
  });
};
const getODPOptions = () => {
  axiosIns.get("options/odp").then((res) => {
    options.value.odp = res?.data?.odp_options || [];
  });
};
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
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.id_odp ? { id_odp: filter_data.value.id_odp } : {}),
    ...(filter_data.value.referral
      ? { referral: filter_data.value.referral }
      : {}),
    ...(filter_data.value.id_router
      ? { id_router: filter_data.value.id_router }
      : {}),
    ...(filter_data.value.status != null
      ? { status: filter_data.value.status }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
    sort_key: sorting_data.value.key,
    sort_direction: sorting_data.value.direction,
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
const getBillingCount = () => {
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.id_odp ? { id_odp: filter_data.value.id_odp } : {}),
    ...(filter_data.value.referral
      ? { referral: filter_data.value.referral }
      : {}),
    ...(filter_data.value.id_router
      ? { id_router: filter_data.value.id_router }
      : {}),
    ...(filter_data.value.status != null
      ? { status: filter_data.value.status }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
    sort_key: sorting_data.value.key,
    sort_direction: sorting_data.value.direction,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`customer/billing-count?${query}`)
    .then((res) => {
      billing_count.value = res.data.billing_count || 0;
    })
    .catch(() => {
      billing_count.value = 0;
    });
};
const getCustomerMapsData = () => {
  is_maps_loading.value = true;
  if (cancel_maps_request_token.value) {
    cancel_maps_request_token.value.cancel();
  }
  cancel_maps_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.id_odp ? { id_odp: filter_data.value.id_odp } : {}),
    ...(filter_data.value.referral
      ? { referral: filter_data.value.referral }
      : {}),
    ...(filter_data.value.id_router
      ? { id_router: filter_data.value.id_router }
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
const deleteCustomer = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pelanggan?",
    `${name} akan dihapus dari daftar pelanggan`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`customer/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pelanggan Telah Dihapus");
        getCustomerData();
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
const editCustomer = (id: string) => {
  router.push({
    path: "/managements/customer/edit-customer",
    query: { id: btoa(id) },
  });
};
const updateCustomerStatus = async (
  id: string,
  name: string,
  status: number
) => {
  const is_confirmed = await confirmAction(
    "Ubah Status Pelanggan?",
    `Status Pelanggan ${name} akan diubah menjadi ${
      customerStatusFormatter(status).title
    }`,
    "Ya, Ubah!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .put(`customer/update-status/${id}`, {
        status: status,
      })
      .then((res) => {
        showActionResult(undefined, undefined, "Status Telah Diubah");
        getCustomerData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};
const rejectCustomer = (id: string, reason: string) => {
  store.loadingHandler(true);
  axiosIns
    .put(`customer/reject/${id}`, {
      reason: reason,
    })
    .then(() => {
      showActionResult(
        undefined,
        undefined,
        "Pengajuan Pelanggan Telah Ditolak!"
      );
      getCustomerData();
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(undefined, "error", message);
    })
    .finally(() => {
      store.loadingHandler(false);
    });
};
const onMarkerHover = (item: any, index: any) => {
  marker_info_index.value = index;
};
const removeQueryPath = (key: string) => {
  const current_query = { ...router.currentRoute.value.query };
  if (key in current_query) {
    delete current_query[key];
    router.replace({ query: current_query });
  }
};
const changeSortDirection = () => {
  sorting_data.value.direction =
    sorting_data.value.direction === "asc" ? "desc" : "asc";
};

// LIFECYCLE HOOKS
onMounted(() => {
  getUserOptions();
  getCustomerData();
  getBillingCount();
  getCustomerMapsData();
  getRouterOptions();
  getODPOptions();
});
</script>
<template>
  <VCard>
    <VCardItem class="py-4">
      <template #prepend>
        <VIcon icon="tabler-user-square-rounded" />
      </template>
      <template #title> Daftar Pelanggan </template>
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
              position: {
                lat: item?.location?.latitude || 0,
                lng: item?.location?.longitude || 0,
              },
            }"
            @mouseover="onMarkerHover(item, index)"
            @click="onMarkerHover(item, index)"
          >
            <InfoWindow v-if="marker_info_index === index">
              <CustomerMapInfo :data="item" />
            </InfoWindow>
          </Marker>
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
          @click="
            getCustomerData(true), getCustomerMapsData(), getBillingCount()
          "
        />
        <div
          v-if="store.isOwner || store.isAdmin || store.isCustomerService"
          class="d-flex gap-2 flex-nowrap"
        >
          <div style="min-width: 10rem">
            <VSelect
              v-model="sorting_data.key"
              :items="options.sorting_key"
              label="Urut Berdasarkan"
              @update:model-value="getCustomerData(false, true)"
            />
          </div>
          <VBtn
            size="40"
            color="secondary"
            @click="changeSortDirection(), getCustomerData(false, true)"
          >
            <VIcon
              :icon="
                sorting_data.direction == 'asc'
                  ? 'tabler-sort-ascending'
                  : 'tabler-sort-descending'
              "
            />
            <VTooltip activator="parent">
              {{
                sorting_data.direction == "asc"
                  ? "Ascending (A-Z)"
                  : "Descending (Z-A)"
              }}
            </VTooltip>
          </VBtn>
        </div>
        <VSpacer />
        <VBtn
          size="40"
          prepend-icon="tabler-plus"
          class="wm-100"
          :to="{ name: 'managements-customer-add-customer' }"
        >
          <VTooltip activator="parent"> Tambah Pelanggan </VTooltip>
        </VBtn>
        <VBtn
          size="40"
          color="info"
          prepend-icon="tabler-filter"
          class="wm-100"
        >
          <VTooltip activator="parent"> Filter </VTooltip>
          <VMenu
            activator="parent"
            :close-on-content-click="false"
            location="bottom"
          >
            <VCard width="300">
              <VCardText class="px-3 py-3 d-flex flex-column gap-2">
                <div class="wm-100" style="min-width: 10rem">
                  <VSelect
                    v-model="filter_data.id_router"
                    label="Router"
                    :items="options.router"
                    item-title="title"
                    item-value="value"
                    clearable
                    @update:model-value="
                      getCustomerData(false, true),
                        getCustomerMapsData(),
                        getBillingCount()
                    "
                  />
                </div>
                <div class="wm-100" style="min-width: 10rem">
                  <VSelect
                    v-model="filter_data.id_odp"
                    label="ODP"
                    :items="options.odp"
                    item-title="title"
                    item-value="value"
                    clearable
                    @update:model-value="
                      getCustomerData(false, true),
                        getCustomerMapsData(),
                        getBillingCount()
                    "
                  />
                </div>
                <div class="wm-100" style="min-width: 10rem">
                  <VAutocomplete
                    v-model="filter_data.referral"
                    label="Referral"
                    :items="options.user.filter((el:any) => el.role !== 99)"
                    item-title="title"
                    item-value="referral"
                    clearable
                    @update:model-value="
                      removeQueryPath('referral'),
                        getCustomerData(false, true),
                        getCustomerMapsData(),
                        getBillingCount()
                    "
                  >
                    <template v-slot:item="{ props, item }">
                      <VListItem v-bind="props" class="px-2">
                        <template #title>
                          <span class="fs-14">
                            {{ item?.raw?.title }}
                          </span>
                        </template>
                        <template #subtitle>
                          <VChip
                            size="x-small"
                            variant="outlined"
                            color="success"
                            class="font-weight-bold"
                          >
                            {{ item?.raw?.referral }}
                          </VChip>
                        </template>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </div>
                <div class="wm-100" style="min-width: 10rem">
                  <VSelect
                    v-model="filter_data.status"
                    label="Status"
                    :items="options.status"
                    item-title="title"
                    item-value="value"
                    clearable
                    @update:model-value="
                      removeQueryPath('status'),
                        getCustomerData(false, true),
                        getCustomerMapsData(),
                        getBillingCount()
                    "
                  />
                </div>
              </VCardText>
            </VCard>
          </VMenu>
        </VBtn>

        <form class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="
              getCustomerData(false, true),
                getCustomerMapsData(),
                getBillingCount()
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
          <div class="py-1">
            <strong>{{ data.name }}</strong>
            <div>
              <VChip>Kode Unik : {{ data?.unique_code }}</VChip>
            </div>
          </div>
        </template>
        <template #cell-registered_at="{ data }">
          {{
            data.registered_at
              ? dateFormatterID(data.registered_at, false)
              : "-"
          }}
        </template>
        <template #cell-service_number="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.service_number }}
          </VChip>
        </template>
        <template #cell-odp_name="{ data }">
          <VChip color="primary" variant="outlined" class="font-weight-bold">
            {{ data.odp_name || "-Tidak Diketahui-" }}
          </VChip>
        </template>
        <template #cell-phone_number="{ data }">
          <a :href="whatsappUrlFormatter(data.phone_number)" target="_blank">
            <VChip
              variant="outlined"
              color="success"
              prepend-icon="tabler-brand-whatsapp"
              class="clickable"
            >
              0{{ data.phone_number }}
            </VChip>
          </a>
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="customerStatusFormatter(data.status).color"
            class="clickable"
          >
            {{ customerStatusFormatter(data.status).title }}
            <VTooltip activator="parent"> Ubah Status </VTooltip>
            <VMenu activator="parent" location="bottom" offset="14px">
              <VCard>
                <VCardText class="d-flex gap-1 px-3 py-3">
                  <VBtn
                    v-for="status in options.status.filter((el:any)=>el.value!==data.status && el.value!=2)"
                    size="small"
                    :color="customerStatusFormatter(status.value).color"
                    @click="
                      updateCustomerStatus(data._id, data.name, status.value)
                    "
                  >
                    {{ customerStatusFormatter(status.value).title }}
                  </VBtn>
                </VCardText>
              </VCard>
            </VMenu>
          </VChip>
        </template>
        <template #cell-ppn="{ data }">
          {{ data.ppn ? `Ya` : "Tidak" }}
        </template>
        <template #cell-due_date="{ data }">
          {{ data.due_date ? `Tanggal ${data.due_date}` : "-" }}
        </template>
        <template #cell-billing="{ data }">
          <div class="text-no-wrap">
            {{ data.billing ? `Rp${thousandSeparator(data.billing)}` : "-" }}
          </div>
        </template>
        <template #cell-referral="{ data }">
          <VChip variant="outlined" :color="data.referral ? 'success' : 'dark'">
            {{ data.referral ? `${data.referral}` : "Tidak Ada" }}
          </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <VBtn v-if="data.status === 2" size="35" color="error">
              <VIcon icon="tabler-x" />
              <VTooltip activator="parent"> Tolak </VTooltip>
              <VMenu activator="parent" :close-on-content-click="false">
                <VCard width="350">
                  <VCardText class="px-3 py-3">
                    <VTextarea v-model="data.rejected_reason">
                      <template #label>
                        Alasan Penolakan <span class="text-error">*</span>
                      </template>
                    </VTextarea>
                    <div class="d-flex justify-end mt-3">
                      <VBtn
                        size="small"
                        color="error"
                        block
                        :disabled="!data.rejected_reason"
                        @click="rejectCustomer(data._id, data.rejected_reason)"
                      >
                        Tolak Pengajuan
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VMenu>
            </VBtn>
            <CustomerDetailModal :data="data" />
            <VBtn size="35" color="info" @click="editCustomer(data._id)">
              <VIcon icon="tabler-edit" />
              <VTooltip activator="parent"> Edit </VTooltip>
            </VBtn>
            <VBtn
              size="35"
              color="error"
              @click="deleteCustomer(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
          </div>
        </template>
        <!-- CUSTOM FOOTER -->
        <template #footer>
          <tr>
            <td colspan="15">
              <div class="d-flex gap-2 justify-end px-5 pt-3 pb-2">
                <div class="font-weight-bold">Total :</div>
                <div class="font-weight-bold">
                  Rp {{ thousandSeparator(billing_count) }}
                </div>
              </div>
              <div class="d-flex justify-end px-5 pb-3">
                <div class="fs-14 text-center">
                  ({{ numberToWords(billing_count) }} Rupiah)
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="10">
              <VDivider></VDivider>
            </td>
          </tr>
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
