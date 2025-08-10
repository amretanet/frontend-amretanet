<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "inventoryRequestUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  inventory: [],
});
const inventory_request_form = ref<VForm>();
const inventory_request_data = ref({
  id_engineer: props?.data?.id_engineer || null,
  id_inventory: props?.data?.id_inventory || null,
  quantity: props?.data?.quantity || 0,
});

// FUNCTION
const getInventoryOptions = () => {
  axiosIns.get("/options/inventory").then((res) => {
    options.value.inventory = res?.data?.inventory_options || [];
  });
};
const updateInventoryrequest = () => {
  inventory_request_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`inventory/requested/update/${props.data._id}`, {
          data: inventory_request_data.value,
        })
        .then(() => {
          emits("inventoryRequestUpdated");
          showActionResult(true, "success", "Barang Telah Diubah!");
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
          <VForm
            ref="inventory_request_form"
            @submit.prevent="updateInventoryrequest"
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
