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
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddTicketModal from "./AddTicketModal.vue";
import EditTicketModal from "./EditTicketModal.vue";

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
      width: "25%",
    },
    {
      title: "PELAPOR",
      key: "reporter",
      th_class: "text-left",
      td_class: "text-left",
      width: "20%",
    },
    {
      title: "PENERIMA TUGAS",
      key: "assignee",
      th_class: "text-left",
      td_class: "text-left",
      width: "20%",
    },
    {
      title: "DESKRIPSI",
      key: "description",
      th_class: "text-left",
      td_class: "text-left",
      width: "20%",
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

// LIFECYCLE HOOKS
onMounted(() => {
  getTicketData();
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
        <AddTicketModal @ticket-added="showActionResult(), getTicketData()" />
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
            <VCard variant="tonal">
              <VCardText class="d-flex flex-column gap-2">
                <div class="d-flex align-center justify-space-between gap-10">
                  <div v-if="data.name" class="font-weight-bold fs-14">
                    #{{ data.name }}
                  </div>
                  <VChip
                    :color="ticketStatusFormatter(data.status).color"
                    variant="flat"
                  >
                    {{ ticketStatusFormatter(data.status).type }}
                  </VChip>
                </div>
                <VDivider />
                <div class="fs-14">
                  Oleh: <span class="font-weight-bold">{{ data.creator }}</span>
                </div>
                <div class="fs-14">
                  Pada:
                  <span class="font-weight-bold">
                    {{ dateFormatterID(data.created_at, false, true) }}
                  </span>
                </div>
              </VCardText>
            </VCard>
          </div>
        </template>
        <template #cell-reporter="{ data }">
          <VChip variant="outlined" color="primary" prepend-icon="tabler-user">
            {{ data.reporter }}
          </VChip>
        </template>
        <template #cell-assignee="{ data }">
          <VChip variant="outlined" color="warning" prepend-icon="tabler-user">
            {{ data.assignee }}
          </VChip>
        </template>
        <template #cell-description="{ data }">
          <div class="d-flex flex-column gap-2 fs-15">
            <div class="font-weight-black text-no-wrap">{{ data.title }}</div>
            <div>{{ data.description }}</div>
          </div>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditTicketModal
              :data="data"
              @ticket-updated="showActionResult(), getTicketData()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteTicket(data._id, data.name)"
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
