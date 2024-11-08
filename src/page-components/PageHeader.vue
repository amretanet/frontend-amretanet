<script setup lang="ts">
// INTERFACE
interface IPathData {
  icon?: string;
  name: string;
  to?: string;
}
interface IProps {
  data: IPathData[];
}

// VARIABLE
const props = defineProps<IProps>();
const path_data = ref(props.data);

// LIFECYCLE HOOKS
watch(props, () => {
  path_data.value = props.data;
});
</script>
<template>
  <div id="page-header">
    <div class="d-flex align-center">
      <div v-for="(item, index) in path_data" class="d-flex align-center gap-1">
        <VIcon v-if="item.icon" :icon="item.icon" />
        <span>{{ item.name }}</span>
        <VIcon
          v-if="path_data.length > 1 && index != path_data.length - 1"
          icon="mdi-chevron-right"
        />
      </div>
      <VSpacer />
      <slot name="extend-header"></slot>
    </div>
  </div>
</template>
