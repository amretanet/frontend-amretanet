<script setup lang="ts">
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const rules_text = ref("");
const is_on_process = ref(false);

// FUNCTION
const getRulesText = () => {
  axiosIns.get("information?type=INFO_RULES").then((res) => {
    rules_text.value = res?.data?.configuration_data?.text || "";
  });
};
const updateRulesText = async () => {
  const is_confirmed = await confirmAction();
  if (is_confirmed) {
    axiosIns
      .put("information/update", {
        type: "INFO_RULES",
        text: rules_text.value,
      })
      .then(() => {
        showActionResult();
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(undefined, "error", message);
      });
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getRulesText();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-vocabulary" />
      </template>
      <template #title> Syarat & Ketentuan </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="rules_text"
        contentType="html"
        theme="snow"
        toolbar="full"
        class="scroller"
        style="max-height: 60vh"
      />
      <div class="d-flex mt-3 gap-2 justify-end">
        <VBtn size="small" color="warning" @click="getRulesText()">
          Reset
        </VBtn>
        <ProcessButton
          :is_on_process="is_on_process"
          @click="updateRulesText()"
        />
      </div>
    </VCardText>
  </VCard>
</template>
