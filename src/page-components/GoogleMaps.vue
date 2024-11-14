<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";

// INTERFACE
interface IProps {
  lat: any;
  lng: any;
  height?: string;
  width?: string;
}
interface IEmits {
  (e: "updateValue", data: any): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();
const maps_config = ref({
  height: props.height || "500px",
  width: props.width || "100%",
});
const latitude = ref(props.lat || -6.942753834597646);
const longitude = ref(props.lng || 107.76403963565826);
const current_marker = computed(() => {
  return {
    lat: latitude.value,
    lng: longitude.value,
  };
});

// FUNCTION
const handleMapsClick = (event: any) => {
  latitude.value = event.latLng.lat();
  longitude.value = event.latLng.lng();
  emit("updateValue", current_marker.value);
};

// LIFECYCLE HOOKS
watch(props, () => {
  if (props.lat && props.lng) {
    latitude.value = parseFloat(props.lat);
    longitude.value = parseFloat(props.lng);
  }
  maps_config.value.height = props.height || "500px";
  maps_config.value.width = props.width || "100%";
});
</script>

<template>
  <div>
    <GoogleMap
      api-key="AIzaSyCzZfGXTjrqa8ML17XiOXre7ulOLx1Z_eA"
      :style="{ width: maps_config.width, height: maps_config.height }"
      :center="current_marker"
      :zoom="20"
      @click="handleMapsClick"
    >
      <Marker :options="{ position: current_marker }" />
    </GoogleMap>
  </div>
</template>
