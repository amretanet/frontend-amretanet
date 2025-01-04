<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import DatePicker from "@/page-components/DatePicker.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import moment from "moment";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "expenditureUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  category: [],
  method: [
    {
      title: "CASH",
      value: "CASH",
    },
    {
      title: "TRANSFER",
      value: "TRANSFER",
    },
  ],
});
const expenditure_form = ref<VForm>();
const expenditure_data = ref({
  nominal: props?.data?.nominal || null,
  category: props?.data?.category || null,
  method: props?.data?.method || null,
  date: props?.data?.date || moment().format("YYYY-MM-DD HH:mm:ss"),
  description: props?.data?.description || null,
});

// FUNCTION
const getExpenditureCategoryOptions = () => {
  axiosIns.get("options/expenditure-category").then((res) => {
    options.value.category = res?.data?.expenditure_category_options || [];
  });
};
const updateExpenditure = () => {
  expenditure_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`expenditure/update/${props.data._id}`, {
          data: expenditure_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Pengeluaran Telah Diubah!");
          emits("expenditureUpdated");
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
watch(props, () => {
  expenditure_data.value = {
    nominal: props?.data?.nominal || null,
    category: props?.data?.category || null,
    method: props?.data?.method || null,
    date: props?.data?.date || moment().format("YYYY-MM-DD HH:mm:ss"),
    description: props?.data?.description || null,
  };
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getExpenditureCategoryOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="info" prepend-icon="tabler-edit">
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
          <template #title> Edit Pengeluaran </template>
        </VCardItem>
        <VCardText>
          <VForm ref="expenditure_form" @submit.prevent="updateExpenditure">
            <VRow>
              <!-- NOMINAL -->
              <VCol cols="12">
                <VTextField
                  v-model="expenditure_data.nominal"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Nominal <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- CATEGORY -->
              <VCol cols="12">
                <VCombobox
                  v-model="expenditure_data.category"
                  :items="options.category"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kategori <span class="text-error">*</span>
                  </template>
                </VCombobox>
              </VCol>
              <!-- METHOD -->
              <VCol cols="5">
                <VAutocomplete
                  v-model="expenditure_data.method"
                  :items="options.method"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Metode <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- DATE -->
              <VCol cols="7">
                <DatePicker v-model:date="expenditure_data.date">
                  <template #label>
                    Tanggal <span class="text-error">*</span>
                  </template>
                </DatePicker>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="expenditure_data.description"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Deskripsi <span class="text-error">*</span>
                  </template>
                </VTextarea>
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
