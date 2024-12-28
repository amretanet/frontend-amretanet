<script setup lang="ts">
import { IObjectKeys } from "@/models";
import { bytesConverter, thousandSeparator } from "@/modules";
import axiosIns from "@/plugins/axios";
import axios from "axios";
import { stateManagement } from "@/store";
import EmptyAlert from "../EmptyAlert.vue";
import SkeletonLoader from "../SkeletonLoader.vue";

// VARIABLES
const store = stateManagement();
const cancel_request_token = ref<any>(null);
const is_on_refresh = ref(true);
const is_loading = ref(true);
const system_resource_data = ref<any>(null);

// FUNCTION
const getSystemResource = (is_refresh: boolean = false) => {
  is_loading.value = true;
  if (is_refresh) {
    is_on_refresh.value = true;
  }
  if (cancel_request_token.value) {
    cancel_request_token.value.cancel();
  }
  cancel_request_token.value = axios.CancelToken.source();
  const params: IObjectKeys = {
    router: store.getCurrentRouter,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`mikrotik/system-resource?${query}`, {
      cancelToken: cancel_request_token.value.token,
    })
    .then((res) => {
      cancel_request_token.value = null;
      system_resource_data.value = res?.data?.system_resource_data || [];
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
  getSystemResource();
});
watch(
  () => store.current_router,
  () => {
    getSystemResource();
  },
  { immediate: true }
);
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-state-machine" />
      </template>
      <template #title>
        Status Mikrotik <strong>({{ store.getCurrentRouter }})</strong>
      </template>
    </VCardItem>
    <VCardText>
      <VRow v-if="is_loading">
        <VCol v-for="item in 8" cols="12" md="3">
          <SkeletonLoader height="60px" rounded="18px" />
        </VCol>
      </VRow>
      <div v-else>
        <VRow v-if="system_resource_data">
          <!-- CPU NAME -->
          <VCol cols="12" md="3">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar icon="tabler-cpu" variant="tonal" color="primary" />
                </div>
                <div>
                  <div class="fs-12">CPU</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["cpu"]
                        ? system_resource_data["cpu"]
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- CPU COUNT -->
          <VCol cols="12" md="3">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-refresh-dot"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">CPU Count</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["cpu-count"]
                        ? thousandSeparator(
                            parseInt(system_resource_data["cpu-count"])
                          )
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- CPU LOAD -->
          <VCol cols="12" md="3">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-loader"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">CPU Load</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["cpu-load"]
                        ? thousandSeparator(system_resource_data["cpu-load"])
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- CPU FREQUENCY -->
          <VCol cols="12" md="3">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-wave-saw-tool"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">CPU Frequency</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["cpu-frequency"]
                        ? thousandSeparator(
                            system_resource_data["cpu-frequency"]
                          )
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- FREE MEMORY -->
          <VCol cols="12" md="6">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-device-sd-card"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">Free Memory</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["free-memory"]
                        ? bytesConverter(
                            parseInt(system_resource_data["free-memory"])
                          )
                        : "0"
                    }}
                    /
                    {{
                      system_resource_data["total-memory"]
                        ? bytesConverter(
                            parseInt(system_resource_data["total-memory"])
                          )
                        : "0"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- FREE HDD SPACE -->
          <VCol cols="12" md="6">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-server-2"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">Free HDD</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["free-hdd-space"]
                        ? bytesConverter(
                            parseInt(system_resource_data["free-hdd-space"])
                          )
                        : "0"
                    }}
                    /
                    {{
                      system_resource_data["total-hdd-space"]
                        ? bytesConverter(
                            parseInt(system_resource_data["total-hdd-space"])
                          )
                        : "0"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- ROUTER BOARD -->
          <VCol cols="12" md="4">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-keyboard"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">Router Board</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["board-name"]
                        ? system_resource_data["board-name"]
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- ROUTER UPTIME -->
          <VCol cols="12" md="4">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-hourglass-empty"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">Router Uptime</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["uptime"]
                        ? system_resource_data["uptime"]
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
          <!-- ROUTER OS -->
          <VCol cols="12" md="4">
            <VCard variant="tonal" class="px-2 py-2">
              <div class="d-flex align-center gap-2">
                <div>
                  <VAvatar
                    icon="tabler-versions"
                    variant="tonal"
                    color="primary"
                  />
                </div>
                <div>
                  <div class="fs-12">Router OS</div>
                  <div class="fs-16 font-weight-black">
                    {{
                      system_resource_data["version"]
                        ? "Version " + system_resource_data["version"]
                        : "-"
                    }}
                  </div>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
        <div v-else>
          <EmptyAlert />
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
