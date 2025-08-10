<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import { stateManagement } from "@/store";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "categoryUpdated"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const category_form = ref<VForm>();
const category_data = ref({
  name: props?.data?.name || null,
  type: props?.data?.type || "INVENTORY",
  description: props?.data?.description || "",
});

// FUNCTION
const updateCategory = () => {
  category_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`categories/update/${props.data._id}`, {
          data: category_data.value,
        })
        .then(() => {
          emits("categoryUpdated");
          showActionResult(true, "success", "Kategori Telah Diubah!");
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
          is_showing_modal.value = false;
        });
    }
  });
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" prepend-icon="tabler-edit">
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Kategori </template>
        </VCardItem>
        <VCardText>
          <VForm ref="category_form" @submit.prevent="updateCategory">
            <VRow>
              <!-- TITLE -->
              <VCol cols="12">
                <VTextField
                  v-model="category_data.name"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Nama <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="category_data.description"
                  label="Deskripsi"
                />
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      size="default"
                      block
                      color="error"
                      @click="is_showing_modal = false"
                    >
                      Batal
                    </VBtn>
                  </VCol>
                  <VCol cols="6">
                    <ProcessButton
                      :is_on_process="is_on_process"
                      size="default"
                      block
                      type="submit"
                      :disabled="is_on_process"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
