<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  confirmAction,
  dataCountFormatter,
  errorMessage,
  roleFormatter,
  setPaginationLength,
  showActionResult,
  whatsappUrlFormatter,
} from "@/modules";
import {
  user_role_customer_options,
  user_role_options,
} from "@/modules/options";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import axios from "axios";
import AddUserModal from "./AddUserModal.vue";
import EditUserModal from "./EditUserModal.vue";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const filter_data = ref({
  key: "",
  role: null,
});
const is_on_refresh = ref(true);
const is_loading = ref(true);
const options = ref({
  role: [...user_role_options, ...user_role_customer_options],
});
const pagination = ref({
  page: 1,
  items: 10,
  count: 0,
});
const user_table_data = ref({
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
      title: "EMAIL",
      key: "email",
      th_class: "text-left",
      td_class: "text-left",
      width: "20%",
    },
    {
      title: "NOMOR TELEPON",
      key: "phone_number",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "KODE REFERRAL",
      key: "referral",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "LEVEL",
      key: "role",
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
const getUserData = (
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
    ...(filter_data.value.role ? { role: filter_data.value.role } : {}),
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`user?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      user_table_data.value.body = res.data.user_data || [];
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
const deleteUser = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pengguna?",
    `${name} akan dihapus dari daftar pengguna`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    store.loadingHandler(true);
    axiosIns
      .delete(`user/delete/${id}`)
      .then(() => {
        showActionResult(undefined, undefined, "Pengguna Telah Dihapus");
        getUserData();
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
const activateUser = async (data: any) => {
  if (store.getUser.role !== 1 && store.getUser.role !== 0) {
    return;
  }
  const is_confirmed = await confirmAction(
    `${data.status ? "Nonaktifkan" : "Aktifkan"} Pengguna?`,
    `${data.name} akan ${data.status ? "dinonaktifkan" : "diaktifkan"}`,
    `Ya, ${data.status ? "Nonaktifkan" : "Aktifkan"}!`
  );

  if (is_confirmed) {
    let payload = data;
    if (data.status) {
      payload.status = 0;
    } else {
      payload.status = 1;
    }
    axiosIns
      .put(`user/update/${data._id}`, { data: payload })
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Pengguna Telah ${payload.status ? "Diaktifkan" : "Dinonaktifkan"}!`
        );
        getUserData();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      });
  }
};
const resetPassword = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Reset Password?",
    `Password pengguna ${name} akan di reset`,
    "Ya, Reset!"
  );
  if (is_confirmed) {
    axiosIns
      .put(`user/reset-password/${id}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Password ${name} Telah Direset!`
        );
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getUserData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-users" />
      </template>
      <template #title> Daftar Pengguna </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getUserData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getUserData(false, true)"
        />
        <VSpacer />
        <!-- ADD USER BUTTON -->
        <AddUserModal @user-added="getUserData()" />
        <!-- ROLE FILTER -->
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            v-model="filter_data.role"
            :items="options.role"
            label="Level"
            clearable
            @update:model-value="getUserData(true)"
          />
        </div>
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getUserData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="user_table_data.headers"
        :body="user_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-email="{ data }">
          <VChip variant="outlined" color="dark" prepend-icon="tabler-mail">
            {{ data.email }}
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
        <template #cell-referral="{ data }">
          <VChip variant="outlined" color="dark">
            {{ data.referral }}
          </VChip>
        </template>
        <template #cell-status="{ data }">
          <VChip
            variant="outlined"
            :color="data.status ? 'success' : 'error'"
            class="clickable"
            @click="activateUser(data)"
          >
            {{ data.status ? "Aktif" : "Nonaktif" }}
          </VChip>
        </template>
        <template #cell-role="{ data }">
          <VChip variant="outlined" :color="roleFormatter(data.role).color">
            {{ roleFormatter(data.role).title }}
          </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <EditUserModal :data="data" @user-updated="getUserData()" />
            <VBtn
              size="35"
              prepend-icon="tabler-key"
              color="warning"
              @click="resetPassword(data._id, data.name)"
            >
              <VTooltip activator="parent"> Reset Password </VTooltip>
            </VBtn>
            <VBtn
              size="35"
              color="error"
              @click="deleteUser(data._id, data.name)"
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
                  user_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getUserData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
