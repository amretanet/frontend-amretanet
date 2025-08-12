<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import { stateManagement } from "@/store";
import { inventory_position_options } from "@/modules/options";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";

// INTERFACE
interface IProps {
  data: any;
  category_options: any[];
}
interface IEmits {
  (e: "inventoryUpdated"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  users: [],
  category: props?.category_options || [],
  unit: ["Pcs", "Meter"],
  position: inventory_position_options,
});
const inventory_form = ref<VForm>();
const inventory_data = ref({
  name: props?.data?.name || null,
  id_category: props?.data?.id_category || null,
  current_quantity: props?.data?.quantity || 0,
  quantity: 0,
  unit: props?.data?.unit || "Pcs",
  description: props?.data?.description || null,
  position: props?.data?.position || "WAREHOUSE",
  id_pic: props?.data?.id_pic || null,
});
const non_pic_position = ref(["WAREHOUSE", "ONSITE"]);

// FUNCTION
const getUserOptions = () => {
  axiosIns.get("options/user").then((response) => {
    options.value.users = response?.data?.user_options || [];
  });
};
const repositionInventory = () => {
  inventory_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      let update_data: any = {
        quantity: inventory_data.value.quantity,
        position: inventory_data.value.position,
      };
      if (!non_pic_position.value.includes(inventory_data.value.position)) {
        update_data.pic = inventory_data.value.id_pic;
      }

      axiosIns
        .put(`inventory/reposition/${props.data._id}`, {
          data: inventory_data.value,
        })
        .then(() => {
          emits("inventoryUpdated");
          showActionResult(true, "success", "Barang Telah Dialihkan!");
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
const userAutocompleteFilter = (
  item_title: any,
  query_text: any,
  item: any
) => {
  const text_one = item?.raw?.title ? item.raw.title.toLowerCase() : "";
  const text_two = item?.raw?.service_number
    ? item.raw.service_number.toString().toLowerCase()
    : "";
  const search_text = query_text.toLowerCase();
  return (
    text_one.indexOf(search_text) > -1 || text_two.indexOf(search_text) > -1
  );
};

// LIFECYCLE HOOKS
watch(props, () => {
  options.value.category = props?.category_options || [];
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getUserOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="warning" prepend-icon="tabler-arrows-cross">
          <VTooltip activator="parent"> Alihkan </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-arrows-cross" />
          </template>
          <template #title> Alihkan Posisi Barang </template>
        </VCardItem>
        <VCardText>
          <VForm ref="inventory_form" @submit.prevent="repositionInventory">
            <VRow>
              <!-- NAME -->
              <VCol cols="12">
                <HorizontalTextFormat
                  title="Nama Barang"
                  :value="inventory_data.name"
                  title_cols="4"
                  value_cols="8"
                />
                <HorizontalTextFormat
                  title="Stok Tersedia"
                  :value="inventory_data.current_quantity"
                  title_cols="4"
                  value_cols="8"
                />
              </VCol>
              <!-- STOK -->
              <VCol cols="12">
                <VTextField v-model="inventory_data.quantity">
                  <template #label>
                    Jumlah Stok Dialihkan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- POSITION -->
              <VCol cols="12">
                <VSelect
                  v-model="inventory_data.position"
                  :items="options.position"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Posisi Barang <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- PIC -->
              <VCol
                cols="12"
                v-if="!non_pic_position.includes(inventory_data.position)"
              >
                <VAutocomplete
                  v-model="inventory_data.id_pic"
                  item-title="title"
                  item-value="value"
                  :items="options.users.filter((el:any)=> el.role == (inventory_data.position == 'CUSTOMER' ? 99 : 5))"
                  :rules="[requiredValidator]"
                  :custom-filter="userAutocompleteFilter"
                >
                  <template #label>
                    {{
                      inventory_data.position == "CUSTOMER"
                        ? "Pelanggan"
                        : "Teknisi"
                    }}
                    <span class="text-error">*</span>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <VListItem v-bind="props" class="px-2">
                      <template #subtitle>
                        <VChip
                          v-if="item?.raw?.service_number"
                          size="x-small"
                          variant="outlined"
                          color="primary"
                          class="font-weight-bold"
                        >
                          {{ item?.raw?.service_number }}
                        </VChip>
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
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
