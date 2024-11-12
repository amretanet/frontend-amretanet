<script setup lang="ts">
// INTERFACE
interface IProps {
  text?: string;
  size?: string;
  color?: string;
  is_on_process: boolean;
}
// VARIABLES
const props = defineProps<IProps>();
const text = ref(props.text || "Simpan");
const size = ref(props.size || "small");
const color = ref(props.color || "success");
const is_on_process = ref(props.is_on_process);

// LIFECYCLE HOOKS
watch(props, () => {
  text.value = props.text || "Simpan";
  size.value = props.size || "small";
  color.value = props.color || "success";
  is_on_process.value = props.is_on_process;
});
</script>
<template>
  <VBtn :color="color" :size="size">
    <template v-if="is_on_process" #prepend>
      <VIcon icon="tabler-refresh" class="rotating-element" />
    </template>
    {{ is_on_process ? "Memproses Data.." : text }}
  </VBtn>
</template>
