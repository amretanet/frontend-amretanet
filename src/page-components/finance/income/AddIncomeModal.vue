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
  (e: "incomeAdded"): void;
}

// VARIABLE
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  user: [],
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
const income_form = ref<VForm>();
const income_data = ref({
  nominal: null,
  category: null,
  method: null,
  date: moment().format("YYYY-MM-DD HH:mm:ss"),
  id_receiver: null,
  description: null,
});

// FUNCTION
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res.data.user_options || [];
  });
};
const getIncomeCategoryOptions = () => {
  axiosIns.get("options/income-category").then((res) => {
    options.value.category = res?.data?.income_category_options || [];
  });
};
const saveIncome = () => {
  income_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("income/add", {
          data: income_data.value,
        })
        .then(() => {
          showActionResult(
            undefined,
            undefined,
            "Pemasukan Telah Ditambahkan!"
          );
          emits("incomeAdded");
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
  income_form.value?.reset();
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getUserOptions();
    getIncomeCategoryOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Pemasukan </VTooltip>
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
          <template #title> Tambah Pemasukan </template>
        </VCardItem>
        <VCardText>
          <VForm ref="income_form" @submit.prevent="saveIncome">
            <VRow>
              <!-- NOMINAL -->
              <VCol cols="12">
                <VTextField
                  v-model="income_data.nominal"
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
                  v-model="income_data.category"
                  :items="options.category"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kategori <span class="text-error">*</span>
                  </template>
                </VCombobox>
              </VCol>
              <!-- RECEIVER -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="income_data.id_receiver"
                  :rules="[requiredValidator]"
                  :items="options.user.filter((el:any)=>el.role!==99)"
                >
                  <template #label>
                    Penerima <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- METHOD -->
              <VCol cols="5">
                <VAutocomplete
                  v-model="income_data.method"
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
                <DatePicker v-model:date="income_data.date">
                  <template #label>
                    Tanggal <span class="text-error">*</span>
                  </template>
                </DatePicker>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="income_data.description"
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
