<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dateFormatterID,
  errorMessage,
  showActionResult,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";
import EditMikrotikSecretModal from "./EditMikrotikSecretModal.vue";

// VARIABLES
const store = stateManagement();
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
const secret_table_data = ref({
  headers: [
    {
      title: "NO",
      key: "no",
      th_class: "text-center",
      td_class: "text-center",
      width: "10px",
    },
    {
      title: "USERNAME",
      key: "name",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PASSWORD",
      key: "password",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "KOMENTAR",
      key: "comment",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PROFILE",
      key: "profile",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TERAKHIR KELUAR",
      key: "last_logged_out",
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
    },
  ],
  body: [],
});

// FUNCTION
const getSecretData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    router: store.getCurrentRouter,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`mikrotik/secret?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      secret_table_data.value.body = res?.data?.secret_data || [];
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
const activateSecret = async (id: string, disabled: boolean) => {
  const is_confirmed = await confirmAction(
    `${disabled ? "Nonaktifkan" : "Aktifkan"} Secret?`,
    `Secret yang dipilih akan ${disabled ? "dinonaktifkan" : "diaktifkan"}`,
    `Ya, ${disabled ? "Nonaktifkan" : "Aktifkan"}!`
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .put(`mikrotik/secret/update/${id}`, {
        data: {
          router: store.getCurrentRouter,
          disabled: disabled,
        },
      })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Secret Telah ${disabled ? "Dinonaktifkan" : "Diaktifkan"}`
        );
        getSecretData();
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
const deleteSecretData = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Secret?",
    `Secret yang dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .put(`mikrotik/secret/delete/${id}`, {
        data: {
          router: store.getCurrentRouter,
        },
      })
      .then(() => {
        showActionResult(undefined, undefined, "Secret Telah Dihapus");
        getSecretData();
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
  getSecretData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-circle-key" />
      </template>
      <template #title>
        Mikrotik Secret <strong>({{ store.getCurrentRouter }})</strong>
      </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- PAGE ITEMS -->
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getSecretData(true)"
        />
        <VSpacer />
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
          />
        </div>
      </div>
    </VCardText>
    <!-- DATA TABLE -->
    <div>
      <DataTable
        height="60vh"
        :headers="secret_table_data.headers"
        :keyword="filter_data.key"
        :body="secret_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- CUSTOM PROFILE -->
        <template #cell-profile="{ data }">
          <VChip variant="outlined" color="success">
            {{ data?.profile || "-" }}
          </VChip>
        </template>
        <!-- CUSTOM LAST LOGGED OUT -->
        <template #cell-last_logged_out="{ data }">
          <VChip variant="outlined" color="dark">
            {{
              data["last-logged-out"]
                ? dateFormatterID(data["last-logged-out"], true, true)
                : "-"
            }}
          </VChip>
        </template>
        <!-- CUSTOM STATUS -->
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="data?.disabled === 'true' ? 'error' : 'success'"
          >
            {{ data?.disabled == "true" ? "Nonaktif" : "Aktif" }}
          </VChip>
        </template>
        <!-- CUSTOM ACTION -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <!-- ACTIVATE BUTTON -->
            <VBtn
              v-if="data?.disabled === 'true'"
              size="35"
              color="success"
              @click="activateSecret(data['.id'], false)"
            >
              <VIcon icon="tabler-checks" />
              <VTooltip activator="parent"> Aktifkan </VTooltip>
            </VBtn>
            <!-- DEACTIVATE BUTTON -->
            <VBtn
              v-else
              size="35"
              color="error"
              @click="activateSecret(data['.id'], true)"
            >
              <VIcon icon="tabler-circle-half-vertical" />
              <VTooltip activator="parent"> Nonaktifkan </VTooltip>
            </VBtn>
            <!-- EDIT BUTTON -->
            <EditMikrotikSecretModal
              :data="data"
              @secret-updated="getSecretData()"
            />
            <!-- DELETE BUTTON -->
            <VBtn
              size="35"
              color="error"
              @click="deleteSecretData(data['.id'])"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
