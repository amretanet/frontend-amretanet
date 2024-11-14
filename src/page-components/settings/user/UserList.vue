<script setup lang="ts">
import { confirmAction, showToastification } from "@/modules";
import DataTable from "@/page-components/DataTable.vue";
import RefreshButton from "@/page-components/RefreshButton.vue";
import AddUserModal from "./AddUserModal.vue";

// VARIABLES
const is_on_refresh = ref(true);
const is_loading = ref(true);
const pagination = ref({
  page: 1,
  items: 10,
  count: 100,
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
      td_class: "text-left",
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
  body: [
    {
      name: "Testing 1",
      phone: "021-2133 1",
      email: "email@gmail.com",
      status: 1,
      role: 1,
    },
    {
      name: "Testing 2",
      phone: "021-2133 2",
      email: "email@gmail.com",
      status: 0,
      role: 2,
    },
    {
      name: "Testing 3",
      phone: "021-2133 3",
      email: "email@gmail.com",
      status: 1,
      role: 1,
    },
    {
      name: "Testing 4",
      phone: "021-2133 4",
      email: "email@gmail.com",
      status: 1,
      role: 3,
    },
    {
      name: "Testing 5",
      phone: "021-2133 5",
      email: "email@gmail.com",
      status: 0,
      role: 4,
    },
  ],
});

// FUNCTION
const getUserData = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }

  setTimeout(() => {
    is_on_refresh.value = false;
    is_loading.value = false;
  }, 1000);
};
const roleFormatter = (role: number) => {
  if (role === 1) {
    return {
      type: "Admin /Owner",
      color: "primary",
    };
  } else if (role === 2) {
    return {
      type: "Sales PPPOE",
      color: "warning",
    };
  } else if (role === 3) {
    return {
      type: "Teknisi /Karyawan",
      color: "success",
    };
  } else {
    return {
      type: "Member PPPOE",
      color: "dark",
    };
  }
};
const deleteUser = async (id: string, name: string) => {
  const is_confirmed = await confirmAction(
    "Hapus Pengguna?",
    `${name} akan dihapus dari daftar pengguna`,
    "Ya, Hapus!"
  );
  if (is_confirmed) {
    showToastification(undefined, undefined, "Pengguna Telah Dihapus!");
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
        <div>
          <VSelect v-model="pagination.items" :items="[5, 10, 25, 50, 100]" />
        </div>
        <RefreshButton
          :is_on_refresh="is_on_refresh"
          @click="getUserData(true)"
        />
        <VSpacer />
        <AddUserModal />
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
        :headers="user_table_data.headers"
        :body="user_table_data.body"
        :items="pagination.items"
        :is_loading="is_loading"
      >
        <template #cell-status="{ data }">
          <VChip :color="data.status ? 'success' : 'error'">
            {{ data.status ? "Aktif" : "Nonaktif" }}
          </VChip>
        </template>
        <template #cell-role="{ data }">
          <VChip :color="roleFormatter(data.role).color">
            {{ roleFormatter(data.role).type }}
          </VChip>
        </template>
        <template #cell-action="{ data }">
          <div class="d-flex gap-2 py-1 justify-center">
            <VBtn size="35" color="info">
              <VIcon icon="tabler-edit" />
              <VTooltip activator="parent"> Edit </VTooltip>
            </VBtn>
            <VBtn
              size="35"
              color="error"
              @click="deleteUser(data.name, data.name)"
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
