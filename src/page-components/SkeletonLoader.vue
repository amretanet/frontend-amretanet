<script setup lang="ts">
// INTERFACE
interface IProps {
  height?: string;
  width?: string;
  rounded?: string;
}

// VARIABLE
const props = defineProps<IProps>();
const height = ref(structuredClone(toRaw(props.height || "100%")));
const rounded = ref(structuredClone(toRaw(props.rounded || "8px")));
const width = ref(structuredClone(toRaw(props.width || "100%")));

// LIFECYCLE HOOKS
watch(props, () => {
  height.value = structuredClone(toRaw(props.height || "100%"));
  rounded.value = structuredClone(toRaw(props.rounded || "8px"));
  width.value = structuredClone(toRaw(props.width || "100%"));
});
</script>
<template>
  <div
    class="skeleton-container"
    :style="{ width: width, height: height, 'border-radius': rounded }"
  >
    <div class="skeleton-loader"></div>
  </div>
</template>
<style>
.skeleton-container {
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}

.skeleton-loader {
  position: absolute;
  animation: progress 1.5s linear infinite;
  background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
  background-size: 200% 100%;
  block-size: 100%;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
}

.v-theme--dark .skeleton-container {
  background: #25293e;
}

.v-theme--dark .skeleton-loader {
  background: linear-gradient(90deg, #25293e, #2f334b, #3b405a);
}

@keyframes progress {
  0% {
    inset-inline-start: -100%;
  }

  100% {
    inset-inline-start: 100%;
  }
}
</style>
