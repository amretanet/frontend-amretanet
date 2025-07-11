<script setup lang="ts">
import { customerStatusFormatter, thousandSeparator } from "@/modules";
import axiosIns from "@/plugins/axios";
import SkeletonLoader from "../SkeletonLoader.vue";
import { IObjectKeys } from "@/models";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const router = useRouter();
const is_loading = ref(true);
const customer_count = ref(0);
const customer_stats_data = ref([
  {
    status: "nonactive",
    status_num: 0,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
  {
    status: "active",
    status_num: 1,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
  {
    status: "pending",
    status_num: 2,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
  {
    status: "free",
    status_num: 3,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
  {
    status: "isolir",
    status_num: 4,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
  {
    status: "paid_leave",
    status_num: 5,
    icon: "tabler-checks",
    color: "success",
    count: 0,
  },
]);

// FUNCTION
const getCustomerStatusStats = () => {
  is_loading.value = true;
  const params: IObjectKeys = {
    ...(store.isCustomer || store.isSales || store.isEngineer || store.isMitra
      ? { referral: store.getUser.referral || null }
      : {}),
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`customer/stats?${query}`)
    .then((res) => {
      const data = res?.data?.customer_stats_data;
      if (data) {
        customer_count.value = data?.count || 0;
        customer_stats_data.value.forEach((el: any) => {
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
const redirectCustomer = (status: number) => {
  router.push({ name: "managements-customer", query: { status: status } });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCustomerStatusStats();
});
</script>

<template>
  <VRow>
    <VCol v-for="item in customer_stats_data" cols="12" md="4" sm="12">
      <SkeletonLoader v-if="is_loading" height="120px" rounded="18px" />
      <VCard
        v-else
        variant="flat"
        class="clickable"
        @click="redirectCustomer(item.status_num)"
      >
        <VCardText>
          <div class="d-flex align-center gap-2">
            <div>
              <VAvatar
                variant="tonal"
                size="70"
                :color="customerStatusFormatter(item.status_num).color"
              >
                <VIcon
                  :icon="customerStatusFormatter(item.status_num).icon"
                  size="35"
                />
              </VAvatar>
            </div>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">
                Pelanggan {{ customerStatusFormatter(item.status_num).title }}
              </div>
              <div>
                <span class="fs-30 font-weight-bold">
                  {{ thousandSeparator(item.count) }}
                  <span class="fs-20">
                    / {{ thousandSeparator(customer_count) }}
                  </span>
                </span>
                <small class="ms-1">(Pelanggan)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
