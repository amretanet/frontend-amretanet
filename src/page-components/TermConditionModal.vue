<script setup lang="ts">
import axiosIns from "@/plugins/axios";

// VARIABLE
const is_showing_modal = ref(false);
const term_condition = ref("");

// FUNCTION
const getTermConditions = () => {
  axiosIns.get("information?type=INFO_RULES").then((res) => {
    term_condition.value = res?.data?.configuration_data?.text || "";
  });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getTermConditions();
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40">
          <VTooltip activator="parent"> Syarat & Ketentuan </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="800">
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #title> Syarat & Ketentuan </template>
        </VCardItem>
        <VCardText>
          <div class="scroller" style="max-height: 70vh">
            <p v-html="term_condition"></p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
