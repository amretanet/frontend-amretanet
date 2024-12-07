<script setup lang="ts">
import {
  confirmedValidator,
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import { gender_options, user_role_options } from "@/modules/options";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "areaUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  provinces: [],
  regency: [],
  subdistrict: [],
  village: [],
});
const coverage_area_form = ref<VForm>();
const coverage_area_data = ref({
  name: props?.data?.name || "",
  address: {
    province: props?.data?.address?.province || null,
    regency: props?.data?.address?.regency || null,
    subdistrict: props?.data?.address?.subdistrict || null,
    village: props?.data?.address?.village || null,
    rw: props?.data?.address?.rw || 0,
    rt: props?.data?.address?.rt || 0,
    location_name: props?.data?.address?.location_name || null,
    postal_code: props?.data?.address?.postal_code || 0,
    latitude: props?.data?.address?.latitude || 0,
    longitude: props?.data?.address?.longitude || 0,
  },
  capacity: props?.data?.capacity || 0,
  available: props?.data?.available || 0,
});

// FUNCTION
const changeLocation = (data: any) => {
  coverage_area_data.value.address.latitude = data.lat;
  coverage_area_data.value.address.longitude = data.lng;
};
const getProvinceOptions = () => {
  axiosIns.get("options/area-province").then((res) => {
    options.value.provinces = res?.data?.province_data || [];
  });
};
const getRegencyOptions = () => {
  if (!coverage_area_data.value.address.province) {
    options.value.regency = [];
    return;
  }
  axiosIns
    .get(
      `options/area-regency?province=${coverage_area_data.value.address.province}`
    )
    .then((res) => {
      options.value.regency = res?.data?.regency_data || [];
    });
};
const getSubdistrictOptions = () => {
  if (!coverage_area_data.value.address.regency) {
    options.value.subdistrict = [];
    return;
  }
  axiosIns
    .get(
      `options/area-subdistrict?regency=${coverage_area_data.value.address.regency}`
    )
    .then((res) => {
      options.value.subdistrict = res?.data?.subdistrict_data || [];
    });
};
const getVillageOptions = () => {
  if (!coverage_area_data.value.address.subdistrict) {
    options.value.village = [];
    return;
  }
  axiosIns
    .get(
      `options/area-village?subdistrict=${coverage_area_data.value.address.subdistrict}`
    )
    .then((res) => {
      options.value.village = res?.data?.village_data || [];
    });
};
const updateCoverageArea = () => {
  coverage_area_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`coverage-area/update/${props.data._id}`, {
          data: coverage_area_data.value,
        })
        .then(() => {
          emits("areaUpdated");
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
          is_showing_modal.value = false;
        });
    }
  });
};

// LIFECYCLE HOOKS
watch(props, () => {
  coverage_area_data.value.name = props?.data?.name || "";
  (coverage_area_data.value.address = {
    province: props?.data?.address?.province || null,
    regency: props?.data?.address?.regency || null,
    subdistrict: props?.data?.address?.subdistrict || null,
    village: props?.data?.address?.village || null,
    rw: props?.data?.address?.rw || 0,
    rt: props?.data?.address?.rt || 0,
    location_name: props?.data?.address?.location_name || null,
    postal_code: props?.data?.address?.postal_code || 0,
    latitude: props?.data?.address?.latitude || 0,
    longitude: props?.data?.address?.longitude || 0,
  }),
    (coverage_area_data.value.capacity = props?.data?.capacity || 0);
  coverage_area_data.value.available = props?.data?.available || 0;
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getProvinceOptions();
    getRegencyOptions();
    getSubdistrictOptions();
    getVillageOptions();
  }
});
watch(
  () => coverage_area_data.value.address.province,
  () => {
    coverage_area_data.value.address.regency = null;
    coverage_area_data.value.address.subdistrict = null;
    coverage_area_data.value.address.village = null;
    getSubdistrictOptions();
  }
);
watch(
  () => coverage_area_data.value.address.regency,
  () => {
    coverage_area_data.value.address.subdistrict = null;
    coverage_area_data.value.address.village = null;
    getSubdistrictOptions();
  }
);
watch(
  () => coverage_area_data.value.address.subdistrict,
  () => {
    coverage_area_data.value.address.village = null;
    getVillageOptions();
  }
);
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="info" prepend-icon="tabler-edit">
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Cakupan Area </template>
        </VCardItem>
        <VCardText>
          <VForm ref="coverage_area_form" @submit.prevent="updateCoverageArea">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="coverage_area_data.name"
                  clearable
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama/Kode Area <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VAutocomplete
                  v-model="coverage_area_data.address.province"
                  :items="options.provinces"
                  clearable
                  :rules="[requiredValidator]"
                  @update:model-value="getRegencyOptions()"
                >
                  <template #label>
                    Provinsi <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol v-if="coverage_area_data.address.province" cols="12">
                <VAutocomplete
                  v-model="coverage_area_data.address.regency"
                  :items="options.regency"
                  clearable
                  :rules="[requiredValidator]"
                  @update:model-value=""
                >
                  <template #label>
                    Kabupaten <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol v-if="coverage_area_data.address.regency" cols="12">
                <VAutocomplete
                  v-model="coverage_area_data.address.subdistrict"
                  :items="options.subdistrict"
                  clearable
                  :rules="[requiredValidator]"
                  @update:model-value=""
                >
                  <template #label>
                    Kecamatan <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol v-if="coverage_area_data.address.subdistrict" cols="12">
                <VAutocomplete
                  v-model="coverage_area_data.address.village"
                  :items="options.village"
                  clearable
                  :rules="[requiredValidator]"
                  @update:model-value=""
                >
                  <template #label>
                    Desa <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol
                v-if="coverage_area_data.address.village"
                cols="12"
                md="4"
                sm="12"
              >
                <VTextField
                  type="number"
                  v-model="coverage_area_data.address.rt"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    RT <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                v-if="coverage_area_data.address.village"
                cols="12"
                md="4"
                sm="12"
              >
                <VTextField
                  type="number"
                  v-model="coverage_area_data.address.rw"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    RW <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                v-if="coverage_area_data.address.village"
                cols="12"
                md="4"
                sm="12"
              >
                <VTextField
                  type="number"
                  v-model="coverage_area_data.address.postal_code"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kode Pos <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol v-if="coverage_area_data.address.village" cols="12">
                <VTextarea
                  v-model="coverage_area_data.address.location_name"
                  rows="2"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Jalan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  type="number"
                  v-model="coverage_area_data.capacity"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kapasitas <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  type="number"
                  v-model="coverage_area_data.available"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Tersedia <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  type="number"
                  v-model="coverage_area_data.address.latitude"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Latitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  type="number"
                  v-model="coverage_area_data.address.longitude"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Longitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <GoogleMaps
                  height="15em"
                  :lat="coverage_area_data.address.latitude"
                  :lng="coverage_area_data.address.longitude"
                  @update-value="changeLocation"
                />
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton
                    :is_on_process="is_on_process"
                    type="submit"
                    :disabled="is_on_process"
                  />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
