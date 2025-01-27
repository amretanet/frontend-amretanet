<script setup lang="ts">
import { IObjectKeys } from "@/models";
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { useLayouts } from "@layouts";

// VARIABLES
const store = stateManagement();
const {
  isVerticalNavCollapsed: isCollapsed,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavMini,
  isAppRtl,
} = useLayouts();
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
    store.loadingHandler(true);
    const params: IObjectKeys = {
      router: store.getCurrentRouter,
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    axiosIns
      .get(`mikrotik/reboot?${query}`)
      .then(() => {
        showActionResult(
          undefined,
          undefined,
          `Router ${current_router.value} Telah di Reboot!`
        );
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      })
      .finally(() => {
        store.loadingHandler(false);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getRouterOptions();
});
</script>
<template>
  <VBtn
    prepend-icon="tabler-router"
    size="small"
    block
    variant="outlined"
    @click="isCollapsed = false"
  >
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
