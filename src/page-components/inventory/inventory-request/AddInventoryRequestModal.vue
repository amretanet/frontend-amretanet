<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";

// INTERFACE
interface IEmits {
  (e: "inventoryRequestAdded"): void;
}

// VARIABLE
const store = stateManagement();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  inventory: [],
});
const inventory_request_form = ref<VForm>();
const inventory_request_data = ref({
  id_engineer: store.getUser._id,
  id_inventory: null,
  quantity: 0,
});

// FUNCTION
const getInventoryOptions = () => {
  axiosIns.get("/options/inventory").then((res) => {
    options.value.inventory = res?.data?.inventory_options || [];
  });
};
const saveInventoryRequest = () => {
  inventory_request_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("inventory/requested/add", {
          data: inventory_request_data.value,
        })
        .then(() => {
          emits("inventoryRequestAdded");
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
  inventory_request_form.value?.reset();
  inventory_request_data.value.quantity = 0;
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getInventoryOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Barang </VTooltip>
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
          <template #title> Tambah Barang </template>
        </VCardItem>
        <VCardText>
          <VForm
            ref="inventory_request_form"
            @submit.prevent="saveInventoryRequest"
          >
            <VRow>
              <!-- NAME -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="inventory_request_data.id_inventory"
                  :items="options.inventory"
                  item-title="name"
                  item-value="_id"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Nama Barang <span class="text-error">*</span>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <VListItem v-bind="props" class="px-2">
                      <template #name>
                        <span class="fs-14">
                          {{ item?.raw?.name }}
                        </span>
                      </template>
                      <template #subtitle>
                        <VChip
                          size="x-small"
                          variant="outlined"
                          color="success"
                          class="font-weight-bold"
                        >
                          Tersisa: {{ item?.raw?.quantity }}
                        </VChip>
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- QUANTITY -->
              <VCol cols="12">
                <VTextField
                  v-model="inventory_request_data.quantity"
                  type="number"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Jumlah Permintaan <span class="text-error">*</span>
                  </template>
                </VTextField>
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
