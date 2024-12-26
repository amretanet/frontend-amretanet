<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import {
  month_options,
  payment_status_options,
  year_options,
} from "@/modules/options";

// INTERFACE
interface IEmits {
  (e: "salaryAdded"): void;
}

// VARIABLE
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  user: [],
  status: payment_status_options,
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
  month: month_options,
  year: year_options,
});
const salary_form = ref<VForm>();
const salary_data = ref({
  id_user: null,
  name: null,
  period: {
    month: null,
    year: null,
  },
  gross_salary: 0,
  deductions: 0,
  bonuses: 0,
  net_salary: 0,
  status: "PAID",
  method: "TRANSFER",
  absence_summary: {
    days_present: 0,
    days_late: 0,
    days_sick: 0,
    days_on_leave: 0,
    days_absent: 0,
  },
  description: null,
});

// FUNCTION
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res.data.user_options || [];
  });
};
const saveSalary = () => {
  salary_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("salary/add", {
          data: salary_data.value,
        })
        .then(() => {
          showActionResult(
            undefined,
            undefined,
            "Gaji Karyawan Telah Ditambahkan!"
          );
          emits("salaryAdded");
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
  salary_data.value = {
    id_user: null,
    name: null,
    period: {
      month: null,
      year: null,
    },
    gross_salary: 0,
    deductions: 0,
    bonuses: 0,
    net_salary: 0,
    status: "PAID",
    method: "TRANSFER",
    absence_summary: {
      days_present: 0,
      days_late: 0,
      days_sick: 0,
      days_on_leave: 0,
      days_absent: 0,
    },
    description: null,
  };
};
const netSalaryCounter = () => {
  if (salary_data.value.gross_salary) {
    const grossSalary = Number(salary_data.value.gross_salary);
    const deductions = Number(salary_data.value.deductions);
    const bonuses = Number(salary_data.value.bonuses);

    const temp_net_salary = grossSalary - deductions;
    salary_data.value.net_salary = temp_net_salary + bonuses;
  }
};

// LIFECYCLE HOOKS
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
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Gaji Karyawan </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="550" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Tambah Gaji Karyawan </template>
        </VCardItem>
        <VCardText>
          <VForm ref="salary_form" @submit.prevent="saveSalary">
            <VRow>
              <!-- MONTH PERIOD -->
              <VCol cols="12" md="7" sm="12">
                <VSelect
                  v-model="salary_data.period.month"
                  :items="options.month"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Periode (Bulan) <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- YEAR PERIOD -->
              <VCol cols="12" md="5" sm="12">
                <VSelect
                  v-model="salary_data.period.year"
                  :items="options.year"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Periode (Tahun) <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- EMPLOYEE -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="salary_data.id_user"
                  :rules="[requiredValidator]"
                  :items="options.user.filter((el:any)=>el.role!==99)"
                >
                  <template #label>
                    Karyawan <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.gross_salary"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Total Gaji <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.deductions"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Potongan Lainnya </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_present"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Masuk Kerja </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_late"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Terlambat </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_sick"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Absen Sakit </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_on_leave"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Absen Izin </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_absent"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Tidak Masuk Kerja </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.bonuses"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Bonus Tambahan </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="salary_data.net_salary" readonly>
                  <template #prepend-inner> Rp </template>
                  <template #label> Gaji Diterima </template>
                </VTextField>
              </VCol>
              <!-- STATUS -->
              <VCol cols="12" md="6" sm="12">
                <VAutocomplete
                  v-model="salary_data.status"
                  :items="options.status"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Status <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- METHOD -->
              <VCol cols="12" md="6" sm="12">
                <VAutocomplete
                  v-model="salary_data.method"
                  :items="options.method"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Metode <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="salary_data.description"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Deskripsi <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="(is_showing_modal = false), resetForm()"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton
                    :is_on_process="is_on_process"
                    type="submit"
                    :disabled="is_on_process"
                  />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
