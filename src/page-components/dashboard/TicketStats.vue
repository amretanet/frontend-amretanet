<script setup lang="ts">
import { thousandSeparator, ticketStatusFormatter } from "@/modules";
import SkeletonLoader from "../SkeletonLoader.vue";
import axiosIns from "@/plugins/axios";
import { IObjectKeys } from "@/models";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const router = useRouter();
const is_loading = ref(true);
const ticket_count = ref(0);
const ticket_stats_data = ref([
  {
    status: "OPEN",
    icon: "tabler-ticket",
    color: "primary",
    count: 0,
  },
  {
    status: "PENDING",
    icon: "tabler-hourglass",
    color: "secondary",
    count: 0,
  },
  {
    status: "ON_PROGRESS",
    icon: "tabler-refresh-dot",
    color: "warning",
    count: 0,
  },
  {
    status: "CLOSED",
    icon: "tabler-clock-check",
    color: "success",
    count: 0,
  },
]);

// FUNCTION
const getTicketStats = () => {
  is_loading.value = true;
  const params: IObjectKeys = {
    ...(store.isEngineer ? { id_assignee: store.getUser._id } : {}),
    ...(store.isCustomer ? { id_reporter: store.getUser._id } : {}),
    ...(!store.isAdmin &&
    !store.isCustomerService &&
    !store.isEngineer &&
    !store.isCustomer
      ? { created_by: store.getUser._id }
      : {}),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`ticket/stats?${query}`)
    .then((res) => {
      const data = res?.data?.ticket_stats_data;
      if (data) {
        ticket_count.value = data?.count || 0;
        ticket_stats_data.value.forEach((el: any) => {
          if (el.status in data) {
            el.count = data[el.status];
          }
        });
      }
    })
    .finally(() => {
      is_loading.value = false;
    });
};
const redirectTicket = (status: string) => {
  router.push({
    name: "managements-service-ticket",
    query: { status: status },
  });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getTicketStats();
});
</script>
<template>
  <VRow>
    <VCol v-for="item in ticket_stats_data" cols="12" md="3" sm="12">
      <SkeletonLoader v-if="is_loading" height="120px" rounded="20px" />
      <VCard
        v-else
        variant="flat"
        :color="ticketStatusFormatter(item.status).color"
        class="clickable"
        @click="redirectTicket(item.status)"
      >
        <VCardText>
          <div class="d-flex align-center gap-2">
            <VAvatar variant="tonal" size="70">
              <VIcon :icon="item.icon" size="35" />
            </VAvatar>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">
                Tiket {{ ticketStatusFormatter(item.status).title }}
              </div>
              <div>
                <span class="fs-30 font-weight-bold">
                  {{ thousandSeparator(item.count) }}
                  <span class="fs-20">
                    / {{ thousandSeparator(ticket_count) }}
                  </span>
                </span>
                <small class="ms-1">(Tiket)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
