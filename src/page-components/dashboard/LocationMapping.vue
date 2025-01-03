<script setup lang="ts">
import { IObjectKeys } from "@/models";
import axiosIns from "@/plugins/axios";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import { Marker } from "vue3-google-map";

// VARIABLES
const current_tab = ref("coverage_area");
const coverage_area_maps_data = ref([]);
const customer_maps_data = ref([]);
const odc_maps_data = ref([]);
const odp_maps_data = ref([]);

// FUNCTION
const getCoverageMapsData = () => {
  const params: IObjectKeys = {
    is_maps_only: true,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`coverage-area?${query}`).then((res) => {
    coverage_area_maps_data.value = res?.data?.coverage_area_maps_data || [];
  });
};
const getCustomerMapsData = () => {
  const params: IObjectKeys = {
    is_maps_only: true,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`customer?${query}`).then((res) => {
    customer_maps_data.value = res?.data?.customer_maps_data || [];
  });
};
const getODCMapsData = () => {
  const params: IObjectKeys = {
    is_maps_only: true,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`odc?${query}`).then((res) => {
    odc_maps_data.value = res?.data?.odc_maps_data || [];
  });
};
const getODPMapsData = () => {
  const params: IObjectKeys = {
    is_maps_only: true,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`odp?${query}`).then((res) => {
    odp_maps_data.value = res?.data?.odp_maps_data || [];
  });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCoverageMapsData();
  getCustomerMapsData();
  getODCMapsData();
  getODPMapsData();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-map-2" />
      </template>
      <template #title> Daftar Lokasi </template>
    </VCardItem>
    <VCardText>
      <VTabs v-model="current_tab">
        <VTab value="coverage_area">Cakupan Area</VTab>
        <VTab value="customer">Pelanggan</VTab>
        <VTab value="odc">ODC</VTab>
        <VTab value="odp">ODP</VTab>
      </VTabs>
    </VCardText>
    <VCardText>
      <div v-if="current_tab == 'coverage_area'">
        <GoogleMaps :zoom="15">
          <template #marker>
            <Marker
              v-for="(item, index) in coverage_area_maps_data"
              :key="index"
              :options="{
                position: item,
              }"
            />
          </template>
        </GoogleMaps>
      </div>
      <div v-if="current_tab == 'customer'">
        <GoogleMaps :zoom="16">
          <template #marker>
            <Marker
              v-for="(item, index) in customer_maps_data"
              :key="index"
              :options="{
                position: item,
              }"
            />
          </template>
        </GoogleMaps>
      </div>
      <div v-if="current_tab == 'odc'">
        <GoogleMaps :zoom="16">
          <template #marker>
            <Marker
              v-for="(item, index) in odc_maps_data"
              :key="index"
              :options="{
                position: item,
              }"
            />
          </template>
        </GoogleMaps>
      </div>
      <div v-if="current_tab == 'odp'">
        <GoogleMaps :zoom="16">
          <template #marker>
            <Marker
              v-for="(item, index) in odp_maps_data"
              :key="index"
              :options="{
                position: item,
              }"
            />
          </template>
        </GoogleMaps>
      </div>
    </VCardText>
  </VCard>
</template>
