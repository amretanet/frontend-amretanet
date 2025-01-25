<script setup lang="ts">
import { IObjectKeys } from "@/models";
import axiosIns from "@/plugins/axios";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import { Marker, InfoWindow } from "vue3-google-map";
import { stateManagement } from "@/store";
import CustomerMapInfo from "../customer/CustomerMapInfo.vue";
import CoverageAreaMapInfo from "../settings/coverage-area/CoverageAreaMapInfo.vue";
import ODCMapInfo from "../settings/hardware/odc/ODCMapInfo.vue";
import ODPMapInfo from "../settings/hardware/odp/ODPMapInfo.vue";

// VARIABLES
const store = stateManagement();
const current_tab = ref("customer");
const coverage_area_maps_data = ref<any[]>([]);
const customer_maps_data = ref<any[]>([]);
const odc_maps_data = ref<any[]>([]);
const odp_maps_data = ref<any[]>([]);
const marker_info_index = ref(null);

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
    ...(isUserWithReferral()
      ? { referral: store.getUser.referral || null }
      : {}),
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
const isUserWithReferral = () => {
  if (store.isCustomer || store.isSales || store.isEngineer || store.isMitra) {
    return true;
  }
  return false;
};
const onMarkerHover = (item: any, index: any) => {
  marker_info_index.value = index;
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
      <template #title>
        Daftar Lokasi {{ isUserWithReferral() ? "Pelanggan Referral" : "" }}
      </template>
    </VCardItem>
    <VCardText v-if="!isUserWithReferral()">
      <VTabs v-model="current_tab">
        <VTab value="customer">Pelanggan</VTab>
        <VTab value="coverage_area">Cakupan Area</VTab>
        <VTab value="odc">ODC</VTab>
        <VTab value="odp">ODP</VTab>
      </VTabs>
    </VCardText>
    <VCardText>
      <div v-if="current_tab == 'customer'">
        <GoogleMaps :zoom="16">
          <template #marker>
            <Marker
              v-for="(item, index) in customer_maps_data"
              :key="index"
              :options="{
                position: {
                  lat: item?.location?.latitude || 0,
                  lng: item?.location?.longitude || 0,
                },
              }"
              @mouseover="onMarkerHover(item, index)"
            >
              <InfoWindow v-if="marker_info_index === index">
                <CustomerMapInfo :data="item" />
              </InfoWindow>
            </Marker>
          </template>
        </GoogleMaps>
      </div>
      <div v-if="current_tab == 'coverage_area'">
        <GoogleMaps :zoom="15">
          <template #marker>
            <Marker
              v-for="(item, index) in coverage_area_maps_data"
              :key="index"
              :options="{
                position: {
                  lat: item?.address?.latitude || 0,
                  lng: item?.address?.longitude || 0,
                },
              }"
              @mouseover="onMarkerHover(item, index)"
            >
              <InfoWindow v-if="marker_info_index === index">
                <CoverageAreaMapInfo :data="item" />
              </InfoWindow>
            </Marker>
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
                position: {
                  lat: item?.location?.latitude || 0,
                  lng: item?.location?.longitude || 0,
                },
              }"
              @mouseover="onMarkerHover(item, index)"
            >
              <InfoWindow v-if="marker_info_index === index">
                <ODCMapInfo :data="item" />
              </InfoWindow>
            </Marker>
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
                position: {
                  lat: item?.location?.latitude || 0,
                  lng: item?.location?.longitude || 0,
                },
              }"
              @mouseover="onMarkerHover(item, index)"
            >
              <InfoWindow v-if="marker_info_index === index">
                <ODPMapInfo :data="item" />
              </InfoWindow>
            </Marker>
          </template>
        </GoogleMaps>
      </div>
    </VCardText>
  </VCard>
</template>
