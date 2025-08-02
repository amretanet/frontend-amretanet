<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  changeSubmissionStatusFormatter,
  confirmAction,
  dataCountFormatter,
  dateFormatterID,
  errorMessage,
  setPaginationLength,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import AddChangeSubmissionModal from "./AddChangeSubmissionModal.vue";
import EditChangeSubmissionModal from "./EditChangeSubmissionModal.vue";
import { change_submission_status_options } from "@/modules/options";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  status: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  status: change_submission_status_options,
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const change_submission_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    ...(store.isOwner || store.isAdmin
      ? [
          {
            title: "NAMA PELANGGAN",
            key: "customer",
            th_class: "text-left",
            td_class: "text-left text-no-wrap",
          },
        ]
      : []),
    {
      title: "JUDUL",
      key: "title",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "NAMA PAKET",
      key: "package",
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
      title: "ALASAN PERUBAHAN",
      key: "reason_message",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PESAN KONFIRMASI",
      key: "confirm_message",
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
const getChangeSubmission = (
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
    ...(store.isCustomer ? { id_customer: store.getUser.id_customer } : {}),
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
    .get(`change-submission?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      change_submission_table_data.value.body =
        res?.data?.change_submission_data || [];
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
const deleteChangeSubmission = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pengajuan?",
    `Pengajuan dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`change-submission/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pengajuan Telah Dihapus");
        getChangeSubmission();
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
const confirmChangeSubmission = async (
  id: string,
  status: string,
  message: string
) => {
  const is_confirmed = await confirmAction(
    `${status === "ACCEPTED" ? "Setujui" : "Tolak"} Pengajuan?`,
    `Pengajuan dipilih akan ${status === "ACCEPTED" ? "disetujui" : "ditolak"}`,
    `Ya, ${status === "ACCEPTED" ? "Setujui" : "Tolak"}!`
  );
  if (is_confirmed) {
    axiosIns
      .put(`change-submission/update/${id}`, {
        data: {
          confirm_message: message,
          status: status,
        },
      })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Pengajuan Telah ${status === "ACCEPTED" ? "Disetujui" : "Ditolak"}!`
        );
        getChangeSubmission();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getChangeSubmission();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-recycle" />
      </template>
      <template #title> Daftar Pengajuan Perubahan </template>
    </VCardItem>
    <!-- FILTER COMPONENT -->
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getChangeSubmission(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getChangeSubmission(false, true)"
        />
        <VSpacer />
        <!-- ADD CHANGE SUBMISSION BUTTON -->
        <AddChangeSubmissionModal
          v-if="store.isCustomer"
          @change-submission-added="getChangeSubmission(true)"
        />
        <!-- STATUS FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            :items="options.status"
            label="Status"
            clearable
            @update:model-value="getChangeSubmission(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getChangeSubmission(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="change_submission_table_data.headers"
        :body="change_submission_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-customer="{ data }">
          {{ data?.customer?.name || "-" }}
        </template>
        <template #cell-title="{ data }">
          {{ data.type == "PPPOE" ? "Ubah Layanan" : "Tambah Layanan" }}
        </template>
        <template #cell-package="{ data }">
          <VChip variant="outlined" color="primary">
            {{ data?.package?.name || "-" }}
          </VChip>
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="changeSubmissionStatusFormatter(data.status).color"
          >
            {{ changeSubmissionStatusFormatter(data.status).title }}
          </VChip>
        </template>
        <template #cell-reason_message="{ data }">
          <div class="text-no-wrap">
            Diajukan pada
            {{ dateFormatterID(data.created_at, true, true) }}
          </div>
          <div class="mt-2 font-weight-bold">
            {{ data?.reason_message || "-" }}
          </div>
        </template>
        <template #cell-confirm_message="{ data }">
          <div v-if="data?.confirmed_at" class="text-no-wrap">
            Dikonfirmasi pada
            {{ dateFormatterID(data.confirmed_at, true, true) }}
          </div>
          <div class="mt-2 font-weight-bold">
            {{ data?.confirm_message || "-" }}
          </div>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <VBtn
              v-if="
                data.status === 'PENDING' && (store.isOwner || store.isAdmin)
              "
              size="35"
              color="success"
              @click="
                confirmChangeSubmission(
                  data._id,
                  'ACCEPTED',
                  'Pengajuan Telah Disetujui'
                )
              "
            >
              <VIcon icon="tabler-checks" />
              <VTooltip activator="parent"> Setujui Pengajuan </VTooltip>
            </VBtn>
            <VBtn
              v-if="
                data.status === 'PENDING' && (store.isOwner || store.isAdmin)
              "
              size="35"
              color="error"
            >
              <VIcon icon="tabler-x" />
              <VTooltip activator="parent"> Tolak Pengajuan </VTooltip>
              <VMenu
                v-model="data.is_show_menu"
                activator="parent"
                width="400"
                :close-on-content-click="false"
              >
                <VCard>
                  <VCardText class="px-3 py-3">
                    <VTextarea v-model="data.temp_confirm_message">
                      <template #label>
                        Alasan Penolakan <span class="text-error">*</span>
                      </template>
                    </VTextarea>
                    <div class="mt-3">
                      <VBtn
                        color="error"
                        size="small"
                        block
                        :disabled="!data.temp_confirm_message"
                        @click="
                          (data.is_show_menu = false),
                            confirmChangeSubmission(
                              data._id,
                              'REJECTED',
                              data.temp_confirm_message
                            )
                        "
                      >
                        Tolak Pengajuan
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VMenu>
            </VBtn>
            <EditChangeSubmissionModal
              :data="data"
              @change-submission-updated="getChangeSubmission()"
            />
            <VBtn
              size="35"
              color="error"
              @click="deleteChangeSubmission(data._id)"
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
                  change_submission_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getChangeSubmission()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
