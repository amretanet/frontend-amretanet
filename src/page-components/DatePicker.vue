<script setup lang="ts">
import { dateFormatterID, dateFormatterParams } from "@/modules";
import { stateManagement } from "@/store";
import { id } from "date-fns/locale";
import moment from "moment";

// INTERFACE
interface IProps {
  date: string;
}
interface IEmits {
  (e: "update:date", date: string): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();
const date_picker = ref();
const date = ref(props.date);
const date_label = ref(dateFormatterID(date.value, true, true));

// FUNCTION
const pickSelectedDate = (selected_date: any) => {
  date.value = dateFormatterParams(selected_date);
  date_label.value = dateFormatterID(date.value, true, true);
  emit("update:date", date.value);
};

// LIFECYCLE HOOKS
</script>
<template>
  <VueDatePicker
    ref="date_picker"
    v-model="date"
    month-name-format="long"
    time-picker-inline
    enable-seconds
    locale="id"
    hours-grid-increment="1"
    minutes-grid-increment="1"
    seconds-grid-increment="1"
    :max-date="new Date()"
    :teleport="true"
    :clearable="false"
    :format-locale="id"
    format="dd LLL yyyy HH:mm:ss"
    @date-update="pickSelectedDate"
  >
    <template #trigger>
      <VTextField v-model="date_label" variant="outlined" readonly>
        <template #label>
          <slot name="label"> Tanggal </slot>
        </template>
        <template #append-inner>
          <VIcon
            icon="tabler-calendar-event"
            size="20"
            style="margin-top: 1px"
          />
        </template>
      </VTextField>
    </template>
    <template #action-buttons>
      <div></div>
    </template>
  </VueDatePicker>
</template>
