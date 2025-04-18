<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  dataCountFormatter,
  dateFormatterID,
  setPaginationLength,
  thousandSeparator,
  confirmAction,
  showActionResult,
  errorMessage,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";
import AcceptFeeModal from "./AcceptFeeModal.vue";

// INTERFACE
interface IProps {
  current_tab: string;
}

// VARIABLES
const store = stateManagement();
const props = defineProps<IProps>();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  id_user: null,
  status: null,
});
const options = ref({
  user: [],
  status: [
    {
      title: "Menunggu Konfirmasi",
      value: "PENDING",
    },
    {
      title: "Disetujui",
      value: "ACCEPTED",
    },
    {
      title: "Ditolak",
      value: "REJECTED",
    },
  ],
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const mitra_fee_table_data = ref({
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
      width: "20%",
    },
    {
      title: "KODE REFERRAL",
      key: "referral",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "KETERANGAN",
      key: "information",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "NOMINAL PENARIKAN",
      key: "nominal",
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
const getMitraFee = (
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
    ...(filter_data.value.status ? { status: filter_data.value.status } : {}),
    ...(filter_data.value.id_user
      ? { id_user: filter_data.value.id_user }
      : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`referral-fee?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      mitra_fee_table_data.value.body = res.data.referral_fee_data || [];
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
const getUserOptions = () => {
  axiosIns.get("options/user?role=6").then((res) => {
    options.value.user = res?.data?.user_options || [];
  });
};
const deleteMitraFee = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Bonus Mitra?",
    `Data terpilih akan dihapus dari daftar bonus mitra`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`referral-fee/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Bonus Mitra Telah Dihapus");
        getMitraFee();
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
const confirmMitraFeeRequest = async (
  id: string,
  status: string,
  description: string
) => {
  const is_confirmed = await confirmAction(
    `${status === "ACCEPTED" ? "Setujui" : "Tolak"} Pengajuan?`,
    `Pengajuan dipilih akan ${status === "ACCEPTED" ? "disetujui" : "ditolak"}`,
    `Ya, ${status === "ACCEPTED" ? "Setujui" : "Tolak"}!`
  );
  if (is_confirmed) {
    axiosIns
      .put(`referral-fee/update/${id}`, {
        data: {
          description: description,
          status: status,
        },
      })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Pengajuan Telah ${status === "ACCEPTED" ? "Disetujui" : "Ditolak"}!`
        );
        getMitraFee();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
// LIFECYCLE HOOKS
onMounted(() => {
  getMitraFee();
  getUserOptions();
});
watch(props, (new_val) => {
  if (new_val.current_tab === "request-fee-list") {
    getMitraFee();
  }
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-swap-horizontal" />
      </template>
      <template #title> Daftar Pengajuan Bonus </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getMitraFee(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getMitraFee(false, true)"
        />
        <VSpacer />
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.status"
            :items="options.status"
            label="Status"
            clearable
            @update:model-value="getMitraFee()"
          />
        </div>
        <div class="wm-100" style="min-width: 10rem">
          <VAutocomplete
            v-model="filter_data.id_user"
            label="Mitra"
            :items="options.user.filter((el:any) => el.role ===6)"
            item-title="title"
            item-value="value"
            clearable
            @update:model-value="getMitraFee(true)"
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
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getMitraFee(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="mitra_fee_table_data.headers"
        :body="mitra_fee_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-information="{ data }">
          <div>
            <div>
              Dibuat Pada :
              <strong>{{ dateFormatterID(data.created_at) }}</strong>
            </div>
            <div v-if="data?.reason">
              Alasan Penarikan :
              <strong>{{ data?.reason || "" }}</strong>
            </div>
            <div v-if="data?.description">
              Keterangan :
              <strong :class="data.status === 'REJECTED' ? 'text-error' : ''">{{
                data.description
              }}</strong>
            </div>
          </div>
        </template>
        <template #cell-nominal="{ data }">
          <div>Rp.{{ thousandSeparator(data?.nominal || 0) }}</div>
        </template>
        <template #cell-status="{ data }">
          <div>
            <VChip
              v-if="data.status === 'PENDING'"
              color="warning"
              variant="outlined"
              size="small"
            >
              MENUNGGU KONFIRMASI
            </VChip>
            <VChip
              v-else-if="data.status === 'ACCEPTED'"
              color="success"
              variant="outlined"
              size="small"
            >
              DISETUJUI
            </VChip>
            <VChip
              v-else-if="data.status === 'REJECTED'"
              color="error"
              variant="outlined"
              size="small"
            >
              DITOLAK
            </VChip>
          </div>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <AcceptFeeModal
              v-if="data.status === 'PENDING' && store.isAdmin"
              :data="data"
              @fee-accepted="getMitraFee()"
            >
              <template #trigger-button>
                <VBtn size="35" color="success">
                  <VIcon icon="tabler-checks" />
                  <VTooltip activator="parent"> Setujui Pengajuan </VTooltip>
                </VBtn>
              </template>
            </AcceptFeeModal>

            <VBtn
              v-if="data.status === 'PENDING' && store.isAdmin"
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
                            confirmMitraFeeRequest(
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
            <VBtn size="35" color="error" @click="deleteMitraFee(data._id)">
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
                  mitra_fee_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getMitraFee()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
