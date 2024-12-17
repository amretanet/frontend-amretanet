<script setup lang="ts">
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const privacy_text = ref("");
const is_on_process = ref(false);

// FUNCTION
const getPrivacyText = () => {
  axiosIns.get("information?type=INFO_PRIVACY").then((res) => {
    privacy_text.value = res?.data?.configuration_data?.text || "";
  });
};
const updatePrivacyText = async () => {
  const is_confirmed = await confirmAction();
  if (is_confirmed) {
    axiosIns
      .put("information/update", {
        type: "INFO_PRIVACY",
        text: privacy_text.value,
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
  getPrivacyText();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-shield-check" />
      </template>
      <template #title> Kebijakan Privasi </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="privacy_text"
        contentType="html"
        theme="snow"
        toolbar="full"
        class="scroller"
        style="max-height: 60vh"
      />
      <div class="d-flex mt-3 gap-2 justify-end">
        <VBtn size="small" color="warning" @click="getPrivacyText()">
          Reset
        </VBtn>
        <ProcessButton
          :is_on_process="is_on_process"
          @click="updatePrivacyText()"
        />
      </div>
    </VCardText>
  </VCard>
</template>
