<script setup lang="ts">
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import ProcessButton from "@/page-components/ProcessButton.vue";

// VARIABLES
const about_text = ref("");
const is_on_process = ref(false);

// FUNCTION
const getAboutText = () => {
  axiosIns.get("information?type=INFO_ABOUT").then((res) => {
    about_text.value = res?.data?.configuration_data?.text || "";
  });
};
const updateAboutText = async () => {
  const is_confirmed = await confirmAction();
  if (is_confirmed) {
    axiosIns
      .put("information/update", {
        type: "INFO_ABOUT",
        text: about_text.value,
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
  getAboutText();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-certificate" />
      </template>
      <template #title> Tentang Kami </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="about_text"
        contentType="html"
        theme="snow"
        toolbar="full"
        class="scroller"
        style="max-height: 60vh"
      />
      <div class="d-flex mt-3 gap-2 justify-end">
        <VBtn size="small" color="warning" @click="getAboutText()">
          Reset
        </VBtn>
        <ProcessButton
          :is_on_process="is_on_process"
          @click="updateAboutText()"
        />
      </div>
    </VCardText>
  </VCard>
</template>
