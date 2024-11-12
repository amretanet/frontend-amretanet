<script setup lang="ts">
import { confirmAction } from "@/modules";

// INTERFACE
interface IPathData {
  icon?: string;
  name: string;
  to?: string;
}
interface IProps {
  data: IPathData[];
  is_show_backup_button?: boolean;
}

// VARIABLE
const props = defineProps<IProps>();
const is_show_backup_button = ref(props.is_show_backup_button || false);
const path_data = ref(props.data);

// FUNCTION
const backupDatabase = async () => {
  const is_confirmed = await confirmAction(
    "Backup Database?",
    "Harap simpan file ditempan yang aman setelah melakukan backup data!",
    "Backup Sekarang!"
  );
  if (is_confirmed) {
    console.log("file berhasil di backup");
  }
};

// LIFECYCLE HOOKS
watch(props, () => {
  path_data.value = props.data;
  is_show_backup_button.value = props.is_show_backup_button || false;
});
</script>
<template>
  <div id="page-header">
    <div class="d-flex flex-wrap gap-2 align-center">
      <div v-for="(item, index) in path_data" class="d-flex align-center gap-1">
        <VIcon v-if="item.icon" :icon="item.icon" />
        <span>{{ item.name }}</span>
        <VIcon
          v-if="path_data.length > 1 && index != path_data.length - 1"
          icon="mdi-chevron-right"
        />
      </div>
      <VSpacer />
      <VBtn
        v-if="is_show_backup_button"
        color="warning"
        prepend-icon="tabler-database-import"
        class="wm-100"
        @click="backupDatabase()"
      >
        Backup Database
        <VTooltip activator="parent" class="text-no-wrap">
          Simpan file backup ditempat yang aman!
        </VTooltip>
      </VBtn>
      <slot name="extend-header"></slot>
    </div>
  </div>
</template>
