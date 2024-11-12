<script setup lang="ts">
// INTERFACE
interface IProps {
  is_on_refresh: boolean;
}
// VARIABLES
const props = defineProps<IProps>();
const is_on_refresh = ref(props.is_on_refresh);

// LIFECYCLE HOOKS
watch(props, () => {
  is_on_refresh.value = props.is_on_refresh;
});
</script>
<template>
  <VBtn color="warning" size="40">
    <VIcon
      icon="tabler-refresh"
      :class="is_on_refresh ? 'rotating-element' : ''"
    />
    <VTooltip activator="parent">
      {{ is_on_refresh ? "Sedang Memuat Ulang..." : "Muat Ulang Data" }}
    </VTooltip>
  </VBtn>
</template>
