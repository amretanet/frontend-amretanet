<script setup lang="ts">
import { thousandSeparator } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";

// VARIABLES
const router = useRouter();
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
});
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
      title: "TANGGAL DAFTAR",
      key: "registration_date",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "25%",
    },
    {
      title: "NO LAYANAN",
      key: "service_number",
      th_class: "text-center",
      td_class: "text-center",
      width: "25%",
    },
    {
      title: "KODE ODP",
      key: "odp_code",
      th_class: "text-center",
      td_class: "text-center text-no-wrap",
      width: "25%",
    },
    {
      title: "NO TELEPHONE",
      key: "phone",
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
      title: "REFERAL",
      key: "referal",
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
  body: [
    {
      name: "Testing 1",
      phone: "021-2133 1",
      registration_date: "07 November 2024",
      service_number: "20039657",
      odp_code: "ODP-ARS/1.1/HSAP2",
      ppn: "",
      due_date: "05",
      billing: 125000,
      refreal: "",
      email: "email@gmail.com",
      status: 1,
      role: 1,
    },
    {
      name: "Testing 2",
      phone: "021-2133 2",
      registration_date: "07 November 2024",
      service_number: "20039657",
      odp_code: "ODP-ARS/1.1/HSAP2",
      ppn: "11",
      due_date: "05",
      billing: 125000,
      refreal: "",
      email: "email@gmail.com",
      status: 0,
      role: 2,
    },
    {
      name: "Testing 3",
      phone: "021-2133 3",
      registration_date: "07 November 2024",
      service_number: "20039657",
      odp_code: "ODP-ARS/1.1/HSAP2",
      ppn: "",
      due_date: "05",
      billing: 125000,
      refreal: "",
      email: "email@gmail.com",
      status: 1,
      role: 1,
    },
    {
      name: "Testing 4",
      phone: "021-2133 4",
      registration_date: "07 November 2024",
      service_number: "20039657",
      odp_code: "ODP-ARS/1.1/HSAP2",
      ppn: "11",
      due_date: "05",
      billing: 125000,
      refreal: "",
      email: "email@gmail.com",
      status: 1,
      role: 3,
    },
    {
      name: "Testing 5",
      phone: "021-2133 5",
      registration_date: "07 November 2024",
      service_number: "20039657",
      odp_code: "ODP-ARS/1.1/HSAP2",
      ppn: "11",
      due_date: "05",
      billing: 125000,
      refreal: "",
      email: "email@gmail.com",
      status: 0,
      role: 4,
    },
  ],
});
const options = ref({
  status: [
    {
      title: "Aktif",
      value: 1,
    },
    {
      title: "Nonaktif",
      value: 0,
    },
    {
      title: "Menunggu",
      value: 3,
    },
    {
      title: "Gratis",
      value: 4,
    },
    {
      title: "Isolir",
      value: 5,
    },
  ],
  odp: [
    {
      title: "ODP-NKD/1.1/HFC4",
      value: "ODP-NKD/1.1/HFC4",
    },
    {
      title: "ODP-NKD/1.1/HFC5",
      value: "ODP-NKD/1.1/HFC5",
    },
    {
      title: "ODP-NKD/1.1/HFC6",
      value: "ODP-NKD/1.1/HFC6",
    },
  ],
  router: [
    {
      title: "AMRETA-2021",
      value: "AMRETA-2021",
    },
    {
      title: "AMRETA-TJW",
      value: "AMRETA-TJW",
    },
    {
      title: "AMRETA-CJK",
      value: "AMRETA-CJK",
    },
  ],
});

// FUNCTION
const getCustomerData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }

  setTimeout(() => {
    is_on_refresh.value = false;
    is_loading.value = false;
  }, 1000);
};
const addCustomer = () => {
  router.push({ name: "master-data-customer-add-customer" });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCustomerData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-user-square-rounded" />
      </template>
      <template #title> Daftar Pelanggan </template>
    </VCardItem>
    <VCardText class="pb-2">
      <div class="d-flex flex-wrap flex-wrap-reverse align-center gap-2">
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getCustomerData(true)"
        />
        <VBtn size="40" prepend-icon="tabler-upload" color="primary">
          <VTooltip activator="parent"> Impor Data </VTooltip>
        </VBtn>
        <VBtn size="40" prepend-icon="tabler-download" color="success">
          <VTooltip activator="parent"> Ekspor Data </VTooltip>
        </VBtn>
        <VSpacer />
        <VBtn
          size="40"
          prepend-icon="tabler-plus"
          class="wm-100"
          @click="addCustomer"
        >
          <VTooltip activator="parent"> Tambah Pelanggan </VTooltip>
        </VBtn>
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            label="Router"
            :items="options.router"
            item-title="title"
            item-value="value"
            clearable
          />
        </div>
        <div class="wm-100" style="min-width: 10rem">
          <VSelect
            label="ODP"
            :items="options.odp"
            item-title="title"
            item-value="value"
            clearable
          />
        </div>
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
        :headers="customer_table_data.headers"
        :body="customer_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-status="{ data }">
          <VChip :color="data.status ? 'success' : 'error'">
            {{ data.status ? "Aktif" : "Nonaktif" }}
          </VChip>
        </template>
        <template #cell-ppn="{ data }">
          <VChip :color="data.ppn ? 'primary' : 'error'">
            {{ data.ppn ? `${data.ppn}%` : "Tidak Ada" }}
          </VChip>
        </template>
        <template #cell-due_date="{ data }">
          {{ data.due_date ? `Tanggal ${data.due_date}` : "-" }}
        </template>
        <template #cell-billing="{ data }">
          <div class="text-no-wrap">
            {{ data.billing ? `Rp. ${thousandSeparator(data.billing)}` : "-" }}
          </div>
        </template>
        <template #cell-referal="{ data }">
          <VChip :color="data.referal ? 'success' : 'error'">
            {{ data.referal ? `${data.referal}` : "Tidak Ada" }}
          </VChip>
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
