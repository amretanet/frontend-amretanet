<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  category_options: any[];
}
interface IEmits {
  (e: "inventoryAdded"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  category: props?.category_options || [],
  unit: ["Pcs", "Meter"],
});
const inventory_form = ref<VForm>();
const inventory_data = ref({
  name: null,
  id_category: null,
  quantity: 0,
  unit: "Pcs",
  description: null,
});

// FUNCTION
const saveInventory = () => {
  inventory_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("inventory/add", {
          data: inventory_data.value,
        })
        .then(() => {
          emits("inventoryAdded");
          resetForm();
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
const resetForm = () => {
  inventory_form.value?.reset();
  inventory_data.value.unit = "Pcs";
  inventory_data.value.quantity = 0;
};

// LIFECYCLE HOOKS
watch(props, () => {
  options.value.category = props?.category_options || [];
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Kategori </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Tambah Kategori </template>
        </VCardItem>
        <VCardText>
          <VForm ref="inventory_form" @submit.prevent="saveInventory">
            <VRow>
              <!-- NAME -->
              <VCol cols="12">
                <VTextField
                  v-model="inventory_data.name"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Nama <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- CATEGORY -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="inventory_data.id_category"
                  :items="options.category"
                  item-title="name"
                  item-value="_id"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Kategori <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- STOK -->
              <VCol cols="12" md="7" sm="12">
                <VTextField
                  v-model="inventory_data.quantity"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Jumlah Stok <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- UNIT -->
              <VCol cols="12" md="5" sm="12">
                <VCombobox
                  v-model="inventory_data.unit"
                  :items="options.unit"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Satuan <span class="text-error">*</span>
                  </template>
                </VCombobox>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="inventory_data.description"
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
                      @click="(is_showing_modal = false), resetForm()"
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
