<script setup lang="ts">
import { IObjectKeys } from "@/models";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import SkeletonLoader from "../SkeletonLoader.vue";
import EmptyAlert from "../EmptyAlert.vue";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const is_loading = ref(true);
const cancel_request_token = ref<any>(null);
const current_notification = ref("PAYMENT_CONFIRM");
const notification_data = ref<any[]>([]);
const notification_count = ref(0);

// FUNCTION
const getNotificationData = () => {
  is_loading.value = true;
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    type: current_notification.value,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`notification?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      notification_data.value = res?.data?.notification_data || [];
      notification_count.value = res?.data?.notification_count || 0;
    })
    .catch((err) => {
      if (err.code !== "ERR_CANCELED") {
        cancel_request_token.value = null;
      }
    })
    .finally(() => {
      if (!cancel_request_token.value) {
        is_loading.value = false;
      }
    });
};
const timeFormatter = (date: string) => {
  const current_date = new Date();
  const input_date = new Date(date);

  if (isNaN(input_date.getTime())) {
    return "Tanggal tidak valid";
  }

  const time_difference = current_date.getTime() - input_date.getTime();
  const seconds = Math.floor(time_difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} hari yang lalu`;
  } else if (hours > 0) {
    return `${hours} jam yang lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  } else {
    return "baru saja";
  }
};
const readNotification = (id: string) => {
  store.loadingHandler(true);
  axiosIns
    .put(`notification/read/${id}`)
    .then(() => {
      const selected_notification = notification_data.value.find(
        (el: any) => el._id === id
      );
      if (selected_notification && !selected_notification.is_read) {
        selected_notification.is_read = 1;
        notification_count.value -= 1;
      }
    })
    .finally(() => {
      store.loadingHandler(false);
    });
};
const readAllNotification = () => {
  store.loadingHandler(true);
  const params: IObjectKeys = {
    type: current_notification.value,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .put(`notification/read-all?${query}`)
    .then(() => {
      getNotificationData();
    })
    .finally(() => {
      store.loadingHandler(false);
    });
};
const deleteAllNotification = () => {
  store.loadingHandler(true);
  const params: IObjectKeys = {
    type: current_notification.value,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .delete(`notification/delete-all?${query}`)
    .then(() => {
      getNotificationData();
    })
    .finally(() => {
      store.loadingHandler(false);
    });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getNotificationData();
});
watch(current_notification, () => {
  getNotificationData();
});
</script>
<template>
  <VBtn icon variant="text" color="default" size="small">
    <VBadge
      v-if="notification_count > 0"
      color="warning"
      :content="notification_count"
    >
      <VIcon icon="tabler-bell" size="24" />
    </VBadge>
    <VIcon v-else icon="tabler-bell" size="24" />
    <VMenu
      activator="parent"
      width="500px"
      offset="14px"
      :close-on-content-click="false"
    >
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-bell" />
          </template>
          <template #title> Notifikasi </template>
          <template #append>
            <VChip
              v-if="notification_count > 0"
              color="warning"
              class="font-weight-bold"
            >
              {{ notification_count }} Pesan Belum Dibaca
            </VChip>
          </template>
        </VCardItem>
        <VCardText>
          <VTabs v-model="current_notification" grow>
            <VTab value="PAYMENT_CONFIRM">Pembayaran</VTab>
            <VTab value="TICKET">Layanan</VTab>
            <VTab value="SYSTEM_ERROR">Server</VTab>
          </VTabs>
        </VCardText>
        <VCardText>
          <div class="scroller" style="max-height: 350px">
            <div v-if="is_loading" class="d-flex flex-column gap-2 scroller">
              <SkeletonLoader v-for="item in 5" height="80px" rounded="18px" />
            </div>
            <div v-else>
              <EmptyAlert
                v-if="notification_data.length === 0"
                title="Notifikasi Kosong!"
              />
              <div v-else class="d-flex flex-column gap-2 scroller">
                <VCard
                  v-for="item in notification_data"
                  class="border clickable"
                  style="box-shadow: none"
                  @click="readNotification(item._id)"
                >
                  <div class="d-flex gap-2 align-center py-3 px-3">
                    <div>
                      <VAvatar
                        v-if="current_notification === 'PAYMENT_CONFIRM'"
                        icon="tabler-wallet"
                        variant="tonal"
                        color="warning"
                        size="50"
                      />
                      <VAvatar
                        v-else-if="current_notification === 'TICKET'"
                        icon="mdi-tools"
                        variant="tonal"
                        color="primary"
                        size="50"
                      />
                      <VAvatar
                        v-else
                        icon="tabler-alert-circle"
                        variant="tonal"
                        color="error"
                        size="50"
                      />
                    </div>
                    <div class="w-100">
                      <div class="d-flex gap-2">
                        <div class="fs-16 font-weight-bold">
                          {{ item.title }}
                        </div>
                        <VSpacer />
                        <div>
                          <small v-if="item.is_read">
                            {{ timeFormatter(item.created_at) }}
                          </small>
                          <VBadge v-else dot>
                            <small class="mr-3">
                              {{ timeFormatter(item.created_at) }}
                            </small>
                          </VBadge>
                        </div>
                      </div>
                      <div class="mt-2">
                        {{ item.description }}
                      </div>
                    </div>
                  </div>
                </VCard>
              </div>
            </div>
          </div>
          <VRow class="mt-2">
            <VCol cols="6">
              <VBtn
                size="small"
                block
                prepend-icon="tabler-trash"
                color="error"
                @click="deleteAllNotification()"
              >
                Hapus Semua
              </VBtn>
            </VCol>
            <VCol cols="6">
              <VBtn
                size="small"
                block
                prepend-icon="tabler-eye"
                color="success"
                @click="readAllNotification()"
              >
                Tandai Sudah Dibaca
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VMenu>
  </VBtn>
</template>
