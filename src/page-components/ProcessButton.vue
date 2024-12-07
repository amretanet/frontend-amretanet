<script setup lang="ts">
// INTERFACE
interface IProps {
  text?: string;
  size?: string;
  color?: string;
  variant?:
    | "flat"
    | "tonal"
    | "text"
    | "elevated"
    | "outlined"
    | "plain"
    | undefined;
  is_on_process: boolean;
}
// VARIABLES
const props = defineProps<IProps>();

// LIFECYCLE HOOKS
</script>
<template>
  <VBtn
    :color="props.color || 'success'"
    :size="props.size || 'small'"
    :variant="props.variant"
  >
    <template v-if="props.is_on_process" #prepend>
      <VIcon icon="tabler-refresh" class="rotating-element" />
    </template>
    <template v-else #prepend>
      <slot name="prepend"></slot>
    </template>
    {{ props.is_on_process ? "Memproses Data.." : props.text || "Simpan" }}
  </VBtn>
</template>
