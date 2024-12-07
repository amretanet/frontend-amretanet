<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";

// INTERFACE
interface IProps {
  lat?: any;
  lng?: any;
  zoom?: number;
  height?: string;
  width?: string;
}
interface IEmits {
  (e: "updateValue", data: any): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();
const google_maps_api = ref(import.meta.env.VITE_GOOGLE_MAPS_API);
const maps_config = ref({
  height: props?.height || "500px",
  width: props?.width || "100%",
  zoom: props?.zoom || 20,
});
const latitude = ref(props?.lat || 0);
const longitude = ref(props?.lng || 0);
const current_marker = computed(() => {
  return {
    lat: latitude.value,
    lng: longitude.value,
  };
});
const maps_center = computed(() => {
  return {
    lat: props?.lat || -6.942853679893406,
    lng: props.lng || 107.76403158903122,
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
  maps_config.value.zoom = props.zoom || 20;
});
</script>

<template>
  <div>
    <GoogleMap
      :api-key="google_maps_api"
      :style="{ width: maps_config.width, height: maps_config.height }"
      :center="maps_center"
      :zoom="maps_config.zoom"
      @click="handleMapsClick"
    >
      <slot name="marker">
        <Marker
          v-if="current_marker.lat && current_marker.lng"
          :options="{ position: current_marker }"
        />
      </slot>
    </GoogleMap>
  </div>
</template>
