<script setup lang="ts">
import { thousandSeparator } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";

// VARIABLES
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
});
const invoice_table_data = ref({
  headers: [
    {
      title: "CHECK",
      key: "check",
      width: "80px",
    },
    {
      title: "NAMA PELANGGAN",
      key: "name",
      th_class: "text-left",
      td_class: "text-left text-no-wrap",
    },
    {
      title: "PERIODE",
      key: "periode",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "TOTAL",
      key: "billing",
      th_class: "text-left",
      td_class: "text-left",
    },
    {
      title: "STATUS",
      key: "status",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
    },
    {
      title: "AKSI",
      key: "action",
      th_class: "text-center",
      td_class: "text-center",
      width: "150px",
    },
  ],
  body: [
    {
      name: "Testing 1",
      periode: "07 November 2024",
      billing: 125000,
      status: 1,
    },
    {
      name: "Testing 2",
      periode: "07 November 2024",
      service_number: "20039657",
      billing: 125000,
      status: 0,
    },
    {
      name: "Testing 3",
      periode: "07 November 2024",
      service_number: "20039657",
      billing: 125000,
      status: 1,
    },
    {
      name: "Testing 4",
      periode: "07 November 2024",
      service_number: "20039657",
      billing: 125000,
      status: 1,
    },
    {
      name: "Testing 5",
      periode: "07 November 2024",
      service_number: "20039657",
      billing: 125000,
      status: 0,
    },
  ],
});
const options = ref({
  status: [
    {
      title: "Sudah Bayar",
      value: 1,
    },
    {
      title: "Belum Bayar",
      value: 0,
    },
  ],
});

// FUNCTION
const getInvoiceData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }

  setTimeout(() => {
    is_on_refresh.value = false;
    is_loading.value = false;
  }, 1000);
};

// LIFECYCLE HOOKS
onMounted(() => {
  getInvoiceData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-file-dollar" />
      </template>
      <template #title> Daftar Transaksi Pelanggan </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getInvoiceData(true)"
        />
        <VSpacer />
        <VBtn size="40" prepend-icon="tabler-plus" class="wm-100">
          <VTooltip activator="parent"> Tambah Pelanggan </VTooltip>
        </VBtn>
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            label="Status"
            :items="options.status"
            item-title="title"
            item-value="value"
            clearable
          />
        </div>
        <form class="wm-100" style="width: 15rem">
          <VTextField
            label="Pencarian"
            append-inner-icon="tabler-search"
            clearable
          />
        </form>
      </div>
    </VCardText>
    <div>
      <DataTable
        :headers="invoice_table_data.headers"
        :body="invoice_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #head-CHECK>
          <div class="d-flex justify-center">
            <VCheckbox />
          </div>
        </template>
        <template #cell-check="{ data }">
          <div class="d-flex justify-center">
            <VCheckbox />
          </div>
        </template>
        <template #cell-status="{ data }">
          <VChip :color="data.status ? 'success' : 'error'">
            {{ data.status ? "Sudah Bayar" : "Belum Bayar" }}
          </VChip>
        </template>
        <template #cell-billing="{ data }">
          <div class="text-no-wrap">
            {{ data.billing ? `Rp. ${thousandSeparator(data.billing)}` : "-" }}
          </div>
        </template>
        <template #cell-action="data">
          <div class="d-flex gap-2 py-1 justify-center">
            <VBtn size="35" color="info">
              <VIcon icon="tabler-edit" />
              <VTooltip activator="parent"> Edit </VTooltip>
            </VBtn>
            <VBtn size="35" color="error">
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent"> Hapus </VTooltip>
            </VBtn>
          </div>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>
