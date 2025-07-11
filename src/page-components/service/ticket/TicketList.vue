<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  setPaginationLength,
  showActionResult,
  ticketStatusFormatter,
  whatsappUrlFormatter,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddTicketModal from "./AddTicketModal.vue";
import EditTicketModal from "./EditTicketModal.vue";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";
import { stateManagement } from "@/store";
import { ticket_status_options } from "@/modules/options";
import DetailTicketModal from "./DetailTicketModal.vue";
import CloseTicketModal from "./CloseTicketModal.vue";
import PendingTicketModal from "./PendingTicketModal.vue";
import SkeletonLoader from "@/page-components/SkeletonLoader.vue";

// VARIABLES
const store = stateManagement();
const router = useRouter();
const routes = useRoute();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  status: routes.query.status || null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const is_user_loading = ref(true);
const options = ref({
  user: [],
  status: ticket_status_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const ticket_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "50px",
    },
    {
      title: "TIKET",
      key: "ticket",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "DIBUAT OLEH",
      key: "creator",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TEKNISI",
      key: "assignee",
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
const getTicketData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    ...(store.isEngineer ? { id_assignee: store.getUser._id } : {}),
    ...(store.isCustomer ? { id_reporter: store.getUser._id } : {}),
    ...(!store.isAdmin &&
    !store.isCustomerService &&
    !store.isEngineer &&
    !store.isCustomer
      ? { created_by: store.getUser._id }
      : {}),
    ...(filter_data.value.key
      ? { key: encodeURIComponent(filter_data.value.key) }
      : {}),
    ...(filter_data.value.status ? { status: filter_data.value.status } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`ticket?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      ticket_table_data.value.body = res.data.ticket_data || [];
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
const deleteTicket = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Tiket?",
    `${name} akan dihapus dari daftar tiket`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    axiosIns
      .delete(`ticket/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Tiket Telah Dihapus");
        getTicketData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
const getUserOptions = () => {
  is_user_loading.value = true;
  axiosIns
    .get("options/user")
    .then((res) => {
      options.value.user = res?.data?.user_options || [];
    })
    .finally(() => {
      is_user_loading.value = false;
    });
};
const updateTicket = (customer_data: any) => {
  store.loadingHandler(true);
  axiosIns
    .put(`ticket/update/${customer_data._id}`, {
      data: customer_data,
    })
    .then(() => {
      showActionResult();
      getTicketData();
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(undefined, "error", message);
    })
    .finally(() => {
      store.loadingHandler(false);
    });
};
const updateTicketStatus = async (id: string, status: string) => {
  const is_confirmed = await confirmAction(
    "Ubah Status?",
    `Status tiket akan diubah menjadi <strong>${
      ticketStatusFormatter(status).title
    }</strong>`,
    "Ya, Ubah!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .put(`ticket/update/${id}`, {
        data: {
          status: status,
        },
      })
      .then(() => {
        showActionResult(undefined, undefined, "Status Tiket Telah Diubah!");
        getTicketData();
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
const removeQueryPath = (key: string) => {
  const current_query = { ...router.currentRoute.value.query };
  if (key in current_query) {
    delete current_query[key];
    router.replace({ query: current_query });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getTicketData();
  getUserOptions();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-ticket" />
      </template>
      <template #title> Daftar Tiket Pengaduan Pelanggan </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getTicketData()"
          />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getTicketData(true)"
        />
        <VSpacer />
        <AddTicketModal
          :user_options="options.user"
          @ticket-added="showActionResult(), getTicketData()"
        />
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            :items="options.status"
            label="Status"
            clearable
            @update:model-value="removeQueryPath('status'), getTicketData()"
          />
        </div>
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getTicketData()"
          />
        </div>
      </div>
    </VCardText>
    <div>
      <DataTable
        height="60vh"
        :headers="ticket_table_data.headers"
        :body="ticket_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-ticket="{ data }">
          <div class="py-2">
            <VCard variant="tonal" style="max-width: 5rem">
              <VCardText class="d-flex flex-column gap-2">
                <div class="d-flex align-center justify-space-between gap-10">
                  <div
                    v-if="data.name"
                    class="font-weight-bold text-primary fs-14"
                  >
                    #{{ data.name }}
                  </div>
                  <VChip variant="outlined" color="dark">
                    {{ dateFormatterID(data.created_at, true, true) }}
                  </VChip>
                </div>
                <VDivider />
                <div class="fs-14">
                  <HorizontalTextFormat
                    v-if="data.reporter"
                    title="Pelanggan"
                    :title_cols="4"
                    :value="data.reporter"
                  />
                  <HorizontalTextFormat
                    title="Judul"
                    :title_cols="4"
                    :value="data.title"
                  />
                  <HorizontalTextFormat
                    title="Deskripsi"
                    :title_cols="4"
                    :value="data.description"
                  />
                </div>
              </VCardText>
            </VCard>
          </div>
        </template>
        <template #cell-creator="{ data }">
          <div class="w-auto" style="width: max-content; min-width: 10rem">
            <VTextField
              v-model="data.creator"
              variant="outlined"
              prepend-inner-icon="mdi-account-edit-outline"
              readonly
            />
          </div>
        </template>
        <template #cell-assignee="{ data }">
          <div class="w-auto" style="width: max-content; min-width: 10rem">
            <SkeletonLoader
              v-if="is_user_loading"
              width="auto"
              height="40px"
              rounded="15px"
            />
            <VAutocomplete
              v-else
              v-model="data.id_assignee"
              :items="options.user.filter((el:any)=>el.role===5)"
              variant="outlined"
              prepend-inner-icon="mdi-account-hard-hat-outline"
              :readonly="
                data.status === 'CLOSED' ||
                (!store.isAdmin && !store.isCustomerService)
              "
              @update:model-value="updateTicket(data)"
            />
          </div>
        </template>
        <template #cell-status="{ data }">
          <VChip
            :color="ticketStatusFormatter(data.status).color"
            variant="flat"
          >
            {{ ticketStatusFormatter(data.status).title }}
          </VChip>
        </template>
        <template #cell-action="{ data, index }">
          <div class="d-flex gap-1 flex-nowrap py-1 justify-center">
            <a
              v-if="data?.customer?.phone_number && store.isEngineer"
              :href="whatsappUrlFormatter(data.customer.phone_number)"
              target="_blank"
            >
              <VBtn prepend-icon="mdi-whatsapp" color="success" size="35">
                <VTooltip activator="parent"> Hubungi Pelanggan </VTooltip>
              </VBtn>
            </a>
            <PendingTicketModal
              v-if="
                store.isEngineer &&
                data.status !== 'CLOSED' &&
                data.status !== 'PENDING'
              "
              :data="data"
              @ticket-pending="getTicketData()"
            />
            <DetailTicketModal :data="data" />
            <EditTicketModal
              v-if="
                (store.isAdmin || store.isCustomerService) &&
                data.status !== 'CLOSED'
              "
              :data="data"
              :user_options="options.user"
              @ticket-updated="getTicketData()"
            />
            <VBtn
              v-if="store.isAdmin || store.isCustomerService"
              size="35"
              color="error"
              @click="deleteTicket(data._id, data.name)"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
            <div v-if="store.isEngineer">
              <VBtn
                v-if="data.status === 'OPEN' && index === 0"
                size="35"
                color="warning"
                @click="updateTicketStatus(data._id, 'ON_PROGRESS')"
              >
                <VIcon icon="tabler-tool"></VIcon>
                <VTooltip activator="parent" class="text-no-wrap">
                  Kerjakan Tiket
                </VTooltip>
              </VBtn>
              <VBtn
                v-if="data.status === 'PENDING'"
                size="35"
                color="warning"
                @click="updateTicketStatus(data._id, 'ON_PROGRESS')"
              >
                <VIcon icon="tabler-tool"></VIcon>
                <VTooltip activator="parent" class="text-no-wrap">
                  Kerjakan Tiket
                </VTooltip>
              </VBtn>

              <CloseTicketModal
                v-if="data.status === 'ON_PROGRESS'"
                :data="data"
                @ticket-closed="getTicketData()"
              />
            </div>
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
                  ticket_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getTicketData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
