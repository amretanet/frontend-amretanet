<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import DatePicker from "@/page-components/DatePicker.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import moment from "moment";

// INTERFACE
interface IEmits {
  (e: "expenditureAdded"): void;
}

// VARIABLE
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
  nominal: null,
  category: null,
  method: null,
  date: moment().format("YYYY-MM-DD HH:mm:ss"),
  description: null,
});

// FUNCTION
const getExpenditureCategoryOptions = () => {
  axiosIns.get("options/expenditure-category").then((res) => {
    options.value.category = res?.data?.expenditure_category_options || [];
  });
};
const saveExpenditure = () => {
  expenditure_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("expenditure/add", {
          data: expenditure_data.value,
        })
        .then(() => {
          showActionResult(
            undefined,
            undefined,
            "Pengeluaran Telah Ditambahkan!"
          );
          emits("expenditureAdded");
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
  expenditure_form.value?.reset();
};

// LIFECYCLE HOOKS
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
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Pengeluaran </VTooltip>
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
          <template #title> Tambah Pengeluaran </template>
        </VCardItem>
        <VCardText>
          <VForm ref="expenditure_form" @submit.prevent="saveExpenditure">
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
