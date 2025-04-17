<script setup lang="ts">
import { IObjectKeys } from "@/models";
import {
  dataCountFormatter,
  setPaginationLength,
  whatsappUrlFormatter,
  thousandSeparator,
} from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import PayOffFeeModal from "./PayOffFeeModal.vue";

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
const mitra_table_data = ref({
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
      title: "EMAIL",
      key: "email",
      th_class: "text-left",
      td_class: "text-left",
      width: "15%",
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
      title: "JUMLAH PELANGGAN",
      key: "customer_count",
      th_class: "text-center",
      td_class: "text-center",
    },
    {
      title: "TOTAL SALDO",
      key: "saldo",
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
const getMitraData = (
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
    role: 6,
    page: pagination.value.page,
    items: pagination.value.items,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`referral-fee/users?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      mitra_table_data.value.body = res.data.user_data || [];
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

// LIFECYCLE HOOKS
onMounted(() => {
  getMitraData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-handshake" />
      </template>
      <template #title> Daftar Mitra </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <!-- ITEMS -->
        <div>
          <VSelect
            v-model="pagination.items"
            :items="[5, 10, 25, 50, 100]"
            @update:model-value="getMitraData(true)"
          />
        </div>
        <!-- REFRESH BUTTON -->
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getMitraData(false, true)"
        />
        <VSpacer />
        <!-- KEYWORD FILTER -->
        <div class="wm-100" style="width: 15rem">
          <VTextField
            v-model="filter_data.key"
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
            @update:model-value="getMitraData(true)"
          />
        </div>
      </div>
    </VCardText>
    <!-- TABLE COMPONENT -->
    <div>
      <DataTable
        height="60vh"
        :headers="mitra_table_data.headers"
        :body="mitra_table_data.body"
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
        <template #cell-customer_count="{ data }">
          <div>{{ thousandSeparator(data?.customer_count || 0) }}</div>
        </template>
        <template #cell-saldo="{ data }">
          <div>Rp.{{ thousandSeparator(data?.saldo || 0) }}</div>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-1 py-1 justify-center">
            <RouterLink
              v-if="data.customer_count > 0"
              :to="{
                name: 'managements-customer',
                query: {
                  referral: data.referral,
                  is_back_button: 1,
                },
              }"
            >
              <VBtn size="35" prepend-icon="tabler-eye" color="success">
                <VTooltip activator="parent"> Lihat Pelanggan </VTooltip>
              </VBtn>
            </RouterLink>
            <VBtn
              v-else
              size="35"
              prepend-icon="tabler-eye"
              color="success"
              disabled
            />

            <PayOffFeeModal
              v-if="data.saldo > 0"
              :data="data"
              @fee-payed-off="getMitraData()"
            >
              <template #trigger-button>
                <VBtn size="35" color="primary" prepend-icon="mdi-wallet">
                  <VTooltip activator="parent"> Bayar Bonus Mitra </VTooltip>
                </VBtn>
              </template>
            </PayOffFeeModal>
            <VBtn
              v-else
              size="35"
              color="primary"
              prepend-icon="mdi-wallet"
              disabled
            />
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
                  mitra_table_data.body.length
                )
              }}
            </h6>
            <VPagination
              v-model="pagination.page"
              :length="setPaginationLength(pagination.items, pagination.count)"
              :total-visible="3"
              size="small"
              class="ms-auto"
              @update:model-value="getMitraData()"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
