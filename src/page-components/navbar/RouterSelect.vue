<script setup lang="ts">
import { confirmAction, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";

// VARIABLES
const store = stateManagement();
const current_router = ref(store.getCurrentRouter);
const options = ref({
  router: [],
});

// FUNCTION
const getRouterOptions = () => {
  axiosIns.get("options/router").then((res) => {
    options.value.router = res?.data?.router_options || [];
  });
};
const rebootRouter = async () => {
  const is_confirmed = await confirmAction(
    "Reboot Router?",
    `Router ${current_router.value} akan di reboot`,
    "Ya, Reboot!"
  );
  if (is_confirmed) {
    showActionResult(
      undefined,
      undefined,
      `Router ${current_router.value} Telah di Reboot!`
    );
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getRouterOptions();
});
</script>
<template>
  <VBtn prepend-icon="tabler-router" size="small" variant="outlined">
    Router
    <VMenu
      activator="parent"
      location="bottom"
      offset="14px"
      :close-on-content-click="false"
    >
      <VCard>
        <VCardText class="d-flex flex-column gap-3 px-3 py-3">
          <VSelect
            v-model="current_router"
            variant="solo"
            density="compact"
            prepend-inner-icon="tabler-router"
            item-title="title"
            item-value="title"
            :items="options.router"
            @update:model-value="store.routerHandler(current_router)"
          />
          <VBtn
            block
            prepend-icon="tabler-power"
            color="warning"
            size="small"
            @click="rebootRouter()"
          >
            Reboot Sekarang
          </VBtn>
        </VCardText>
      </VCard>
    </VMenu>
  </VBtn>
</template>
