<script setup lang="ts">
import { IObjectKeys } from "@/models";
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";

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
const profile_table_data = ref({
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
      td_class: "text-left",
    },
    {
      title: "LOCAL ADDRESS",
      key: "local-address",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "REMOTE ADDRESS",
      key: "remote-address",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "RATE LIMIT",
      key: "rate-limit",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "PARENT",
      key: "parent-queue",
      th_class: "text-left",
      td_class: "text-left",
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
const getProfileData = (is_refresh: boolean = false) => {
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
    .get(`mikrotik/profile?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      profile_table_data.value.body = res?.data?.profile_data || [];
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
const deleteProfileData = async (id: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Profile?",
    `Profile yang dipilih akan dihapus`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .put(`mikrotik/profile/delete/${id}`, {
        data: {
          router: store.getCurrentRouter,
        },
      })
      .then(() => {
        showActionResult(undefined, undefined, "Profile Telah Dihapus");
        getProfileData();
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
  getProfileData();
});
watch(
  () => store.current_router,
  () => {
    getProfileData();
  },
  { immediate: true }
);
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-list-details" />
      </template>
      <template #title>
        Profile Mikrotik <strong>({{ store.getCurrentRouter }})</strong>
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
          @click="getProfileData(true)"
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
        :headers="profile_table_data.headers"
        :keyword="filter_data.key"
        :body="profile_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <!-- CUSTOM ACTION -->
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <!-- DELETE BUTTON -->
            <VBtn
              size="35"
              color="error"
              @click="deleteProfileData(data['.id'])"
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
