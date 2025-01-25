<script setup lang="ts">
import { dateFormatterID, dateFormatterParams } from "@/modules";
import { stateManagement } from "@/store";
import { id } from "date-fns/locale";
import moment from "moment";

// INTERFACE
interface IProps {
  from: any;
  to: any;
}
interface IEmits {
  (e: "dateChange"): void;
  (e: "update:from", from: string): void;
  (e: "update:to", to: string): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();
const date_picker = ref();
const date = ref([props.from, props.to]);
const date_from = ref("");
const date_to = ref("");
const date_filter = ref(
  `${dateFormatterID(date.value[0], true, true)} - ${dateFormatterID(
    date.value[1],
    true,
    true
  )}`
);
const shortcut_button = ref([
  {
    title: "Hari Ini",
    value: "today",
  },
  // {
  //   title: "Kemarin",
  //   value: "yesterday",
  // },
  {
    title: "7 Hari Terakhir",
    value: "last_week",
  },
  {
    title: "Bulan Ini",
    value: "this_month",
  },
  {
    title: "1 Bulan Terakhir",
    value: "last_one_month",
  },
  {
    title: "3 Bulan Terakhir",
    value: "last_three_month",
  },
  {
    title: "Tahun Ini",
    value: "this_year",
  },
]);

// FUNCTION
function cancelPickDate() {
  date_picker.value.closeMenu();
}
function pickSelectedDate() {
  date_picker.value.selectDate();
  date_from.value = date.value[0];
  date_to.value = date.value[1];
  date_filter.value = `${dateFormatterID(
    date_from.value,
    true,
    true
  )} - ${dateFormatterID(date_to.value, true, true)}`;
  const date_emit = {
    from: dateFormatterParams(date.value[0]),
    to: dateFormatterParams(date.value[1]),
  };
  emit("update:from", date_emit.from);
  emit("update:to", date_emit.to);
  emit("dateChange");
}
function shortcutDate(type: string) {
  if (type == "today") {
    date_from.value = moment().format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  } else if (type == "yesterday") {
    date_from.value = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().subtract(1, "days").format("YYYY-MM-DD 23:59:59");
  } else if (type == "last_week") {
    date_from.value = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  } else if (type == "this_month") {
    date_from.value = moment().startOf("month").format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  } else if (type == "last_one_month") {
    date_from.value = moment()
      .subtract(1, "months")
      .format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  } else if (type == "last_three_month") {
    date_from.value = moment()
      .subtract(2, "months")
      .format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  } else if (type == "this_year") {
    date_from.value = moment().startOf("year").format("YYYY-MM-DD 00:00:00");
    date_to.value = moment().format("YYYY-MM-DD 23:59:59");
  }
  date.value = [date_from.value, date_to.value];
}

// LIFECYCLE HOOKS
watch(props, () => {
  date.value = [props.from, props.to];
});
</script>
<template>
  <div>
    <VueDatePicker
      ref="date_picker"
      v-model="date"
      range
      format="dd LLL yyyy HH:mm:ss"
      month-name-format="long"
      time-picker-inline
      enable-seconds
      locale="id"
      hours-grid-increment="1"
      minutes-grid-increment="1"
      seconds-grid-increment="1"
      :max-date="new Date()"
      :multi-calendars="{ solo: false }"
      teleport-center
      :clearable="false"
      :partial-range="false"
      :format-locale="id"
      class="date-range"
    >
      <template #trigger>
        <VTextField
          v-model="date_filter"
          label="Tanggal"
          variant="outlined"
          readonly
        >
          <template #append-inner>
            <VIcon
              icon="tabler-calendar-event"
              size="20"
              style="margin-top: 1px"
            />
          </template>
        </VTextField>
      </template>
      <template #action-extra>
        <div class="px-2">
          <VCard
            class="d-flex gap-2 mt-2 border-custom rounded pe-0 py-2"
            style="padding-left: 10px; box-shadow: none"
          >
            <VChip
              v-for="item in shortcut_button"
              :key="item.value"
              label
              variant="flat"
              size="x-small"
              color="primary"
              class="clickable"
              @click="shortcutDate(item.value)"
            >
              {{ item.title }}
            </VChip>
          </VCard>
        </div>
      </template>
      <template #action-buttons>
        <div class="d-flex">
          <VBtn size="small" color="error" @click="cancelPickDate">
            Batal
          </VBtn>
          <VBtn
            size="small"
            color="success"
            class="ms-1"
            @click="pickSelectedDate"
          >
            Simpan
          </VBtn>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>
