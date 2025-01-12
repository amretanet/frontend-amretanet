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
interface IProps {
  data: any;
}
interface IEmits {
  (e: "salaryUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
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
  id_user: props?.data?.id_user || null,
  name: props?.data?.name || null,
  period: {
    month: props?.data?.period?.month || null,
    year: props?.data?.period?.year || null,
  },
  basic_salary: props?.data?.basic_salary || 0,
  overtime_allowance: props?.data?.overtime_allowance || 0,
  transport_allowance: props?.data?.transport_allowance || 0,
  bpjs_allowance: props?.data?.bpjs_allowance || 0,
  other_allowance: props?.data?.other_allowance || 0,
  cash_deduction: props?.data?.cash_deduction || 0,
  bpjs_deduction: props?.data?.bpjs_deduction || 0,
  absent_deduction: props?.data?.absent_deduction || 0,
  other_deduction: props?.data?.other_deduction || 0,
  salary: 0,
  status: props?.data?.status || "PAID",
  method: props?.data?.method || "TRANSFER",
  absence_summary: {
    days_present: props?.data?.days_present || 0,
    days_late: props?.data?.days_late || 0,
    days_sick: props?.data?.days_sick || 0,
    days_on_leave: props?.data?.days_on_leave || 0,
    days_absent: props?.data?.days_absent || 0,
  },
  description: props?.data?.description || "Gaji Karyawan",
});

// FUNCTION
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res.data.user_options || [];
  });
};
const updateSalary = () => {
  salary_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`salary/update/${props.data._id}`, {
          data: salary_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Gaji Karyawan Telah Diubah!");
          emits("salaryUpdated");
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
const netSalaryCounter = () => {
  if (salary_data.value.basic_salary) {
    const toNumber = (value: any) => Number(value) || 0;
    const allowance =
      toNumber(salary_data.value.bpjs_allowance) +
      toNumber(salary_data.value.overtime_allowance) +
      toNumber(salary_data.value.transport_allowance) +
      toNumber(salary_data.value.other_allowance);

    const deduction =
      toNumber(salary_data.value.cash_deduction) +
      toNumber(salary_data.value.bpjs_deduction) +
      toNumber(salary_data.value.absent_deduction) +
      toNumber(salary_data.value.other_deduction);
    const salary_count =
      toNumber(salary_data.value.basic_salary) + allowance - deduction;

    salary_data.value.salary = salary_count;
  }
};

// LIFECYCLE HOOKS
watch(props, () => {
  salary_data.value = {
    id_user: props?.data?.id_user || null,
    name: props?.data?.name || null,
    period: {
      month: props?.data?.period?.month || null,
      year: props?.data?.period?.year || null,
    },
    basic_salary: props?.data?.basic_salary || 0,
    overtime_allowance: props?.data?.overtime_allowance || 0,
    transport_allowance: props?.data?.transport_allowance || 0,
    bpjs_allowance: props?.data?.bpjs_allowance || 0,
    other_allowance: props?.data?.other_allowance || 0,
    cash_deduction: props?.data?.cash_deduction || 0,
    bpjs_deduction: props?.data?.bpjs_deduction || 0,
    absent_deduction: props?.data?.absent_deduction || 0,
    other_deduction: props?.data?.other_deduction || 0,
    salary: 0,
    status: props?.data?.status || "PAID",
    method: props?.data?.method || "TRANSFER",
    absence_summary: {
      days_present: props?.data?.days_present || 0,
      days_late: props?.data?.days_late || 0,
      days_sick: props?.data?.days_sick || 0,
      days_on_leave: props?.data?.days_on_leave || 0,
      days_absent: props?.data?.days_absent || 0,
    },
    description: props?.data?.description || "Gaji Karyawan",
  };
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
          <template #title> Edit Pemasukan </template>
        </VCardItem>
        <VCardText>
          <VForm ref="salary_form" @submit.prevent="updateSalary">
            <VRow>
              <!-- MONTH PERIOD -->
              <VCol cols="12" md="7" sm="12">
                <VAutocomplete
                  v-model="salary_data.period.month"
                  :items="options.month"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Periode (Bulan) <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- YEAR PERIOD -->
              <VCol cols="12" md="5" sm="12">
                <VAutocomplete
                  v-model="salary_data.period.year"
                  :items="options.year"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Periode (Tahun) <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
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
              <!-- PRESENT -->
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_present"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Masuk Kerja </template>
                </VTextField>
              </VCol>
              <!-- LATE -->
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_late"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Terlambat </template>
                </VTextField>
              </VCol>
              <!-- SICK -->
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_sick"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Absen Sakit </template>
                </VTextField>
              </VCol>
              <!-- ON LEAVE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_on_leave"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Absen Izin </template>
                </VTextField>
              </VCol>
              <!-- ABSENT -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.absence_summary.days_absent"
                  :rules="[integerValidator]"
                  type="number"
                >
                  <template #label> Tidak Masuk Kerja </template>
                </VTextField>
              </VCol>
              <!-- BASIC SALARY -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.basic_salary"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Gaji Pokok <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- OVERTIME ALLOWANCE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.overtime_allowance"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Tunjangan Lembur </template>
                </VTextField>
              </VCol>
              <!-- TRANSPORT ALLOWANCE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.transport_allowance"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Tunjangan Transportasi </template>
                </VTextField>
              </VCol>
              <!-- BPJS ALLOWANCE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.bpjs_allowance"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Tunjangan BPJS </template>
                </VTextField>
              </VCol>
              <!-- OTHER ALLOWANCE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.other_allowance"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Tunjangan Lainnya </template>
                </VTextField>
              </VCol>
              <!-- CASH DEDUCTION -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.cash_deduction"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Potongan Kasbon </template>
                </VTextField>
              </VCol>
              <!-- BPJS DEDUCTION -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.bpjs_deduction"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Potongan BPJS </template>
                </VTextField>
              </VCol>
              <!-- ABSENT DEDUCTION -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.absent_deduction"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Potongan Absensi </template>
                </VTextField>
              </VCol>
              <!-- OTHER DEDUCTION -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="salary_data.other_deduction"
                  :rules="[integerValidator]"
                  type="number"
                  @update:model-value="netSalaryCounter()"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label> Potongan Lainnya </template>
                </VTextField>
              </VCol>
              <!-- NET SALARY -->
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="salary_data.salary" readonly>
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
                  readonly
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
