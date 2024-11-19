<script setup lang="ts">
import { confirmAction, errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import ProcessButton from "../ProcessButton.vue";

// VARIABLES
const announcement = ref("");
const is_on_process = ref(false);

// FUNCTION
const getAnnouncementText = () => {
  axiosIns.get("information?type=INFO_ANNOUNCEMENT").then((res) => {
    announcement.value = res?.data?.configuration_data?.text || "";
  });
};
const updateAnnouncementText = async () => {
  const is_confirmed = await confirmAction();
  if (is_confirmed) {
    axiosIns
      .put("information/update", {
        type: "INFO_ANNOUNCEMENT",
        text: announcement.value,
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
  getAnnouncementText();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-bell-ringing" />
      </template>
      <template #title> Pengumuman </template>
    </VCardItem>
    <VCardText>
      <QuillEditor
        v-model:content="announcement"
        contentType="html"
        theme="snow"
        toolbar="full"
        class="scroller"
        style="max-height: 60vh"
      />
      <div class="d-flex mt-3 gap-2 justify-end">
        <VBtn size="small" color="warning" @click="getAnnouncementText()">
          Reset
        </VBtn>
        <ProcessButton
          :is_on_process="is_on_process"
          @click="updateAnnouncementText()"
        />
      </div>
    </VCardText>
  </VCard>
</template>
