<script setup lang="ts">
// INTERFACE
interface IProps {
  title?: string;
  subtitle?: string;
}

// VARIABLE
const props = defineProps<IProps>();
const title = ref(props.title || "Mohon Maaf, Data Tidak Tersedia!");
const subtitle = ref(props.subtitle || "");

// LIFECYCLE HOOKS
watch(props, () => {
  title.value = props.title || "Mohon Maaf, Data Tidak Tersedia!";
  subtitle.value = props.subtitle || "";
});
</script>
<template>
  <VAlert color="error" variant="tonal">
    <div>
      <img
        src="@/assets/images/illustrations/empty-data.png"
        alt="Empty Data"
        style="height: 100px"
      />
    </div>
    <div>
      <strong>
        {{ title }}
      </strong>
    </div>
    <div v-if="subtitle">
      {{ subtitle }}
    </div>
  </VAlert>
</template>
