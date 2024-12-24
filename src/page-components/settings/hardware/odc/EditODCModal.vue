<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult, uploadImageFile } from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import uploadfile from "@/assets/images/illustrations/uploadfile.png";
import { tube_color_options } from "@/modules/options";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "odcUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const image_file = ref<File[]>([]);
const image_path = ref(props.data.image_url || "");
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  tube_color: tube_color_options,
});
const odc_form = ref<VForm>();
const odc_data = ref({
  name: props.data.name || "",
  image_url: props.data.image_url || "",
  location: {
    address: props.data.location.address || "",
    longitude: props.data.location.longitude || 0,
    latitude: props.data.location.latitude || 0,
  },
  port: props.data.port || 0,
  capacity: props.data.capacity || 0,
  available: props.data.available || 0,
  damping: props.data.damping || 0,
  tube: props.data.tube || null,
  description: props.data.description || "",
});

// FUNCTION
const validateODCForm = async () => {
  odc_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      updateODC();
    }
  });
};
const updateODC = async () => {
  is_on_process.value = true;
  if (image_file.value.length > 0) {
    const image_url = await uploadImageFile(
      image_file.value[0],
      "odc_attachment"
    );
    if (image_url) {
      odc_data.value.image_url = image_url;
    }
  }
  axiosIns
    .put(`odc/update/${props.data._id}`, {
      data: odc_data.value,
    })
    .then(() => {
      showActionResult(undefined, undefined, "ODC Telah Diubah!");
      emits("odcUpdated");
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(true, "error", message);
    })
    .finally(() => {
      is_on_process.value = false;
      is_showing_modal.value = false;
    });
};
const changeLocation = (data: any) => {
  odc_data.value.location.latitude = data.lat;
  odc_data.value.location.longitude = data.lng;
};
const handleImgError = (event: any) => {
  event.target.src = uploadfile;
};
const previewImage = (e: any) => {
  image_file.value = e?.target?.files;
  image_path.value = image_file.value
    ? URL.createObjectURL(image_file.value[0])
    : " ";
};
const inputImageFile = () => {
  const input_form = document.getElementById("profile-input-image");
  input_form?.click();
};

// LIFECYCLE HOOKS
watch(props, () => {
  odc_data.value = {
    name: props.data.name || "",
    image_url: props.data.image_url || "",
    location: {
      address: props.data.location.address || "",
      longitude: props.data.location.longitude || 0,
      latitude: props.data.location.latitude || 0,
    },
    port: props.data.port || 0,
    capacity: props.data.capacity || 0,
    available: props.data.available || 0,
    damping: props.data.damping || 0,
    tube: props.data.tube || null,
    description: props.data.description || "",
  };
  image_path.value = props.data.image_url || "";
});
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
          <template #title> Edit ODC </template>
        </VCardItem>
        <VCardText>
          <VForm ref="odc_form" @submit.prevent="validateODCForm">
            <VRow>
              <VCol cols="5">
                <div class="text-center">
                  <div class="clickable" @click="inputImageFile">
                    <img
                      v-if="image_path"
                      :src="image_path"
                      alt="profile"
                      style="
                        width: 100%;
                        max-height: 110px;
                        object-fit: contain;
                      "
                      @error="handleImgError"
                    />
                    <div
                      v-else
                      class="border rounded-lg py-2"
                      style="height: 105px; max-width: 230px"
                    >
                      <img :src="uploadfile" alt="" style="height: 70%" />
                      <div class="fsm-12">Upload Gambar</div>
                    </div>
                  </div>
                  <!-- PROFILE INPUT -->
                  <div class="profile-input mt-2 d-flex">
                    <input
                      type="file"
                      id="profile-input-image"
                      accept="image/*"
                      @change="previewImage"
                      style="display: none"
                    />
                  </div>
                </div>
              </VCol>
              <VCol cols="7">
                <VRow>
                  <!-- NAME -->
                  <VCol cols="12">
                    <VTextField
                      v-model="odc_data.name"
                      clearable
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Nama/Kode ODC <span class="text-error">*</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <!-- TUBE COLOR -->
                  <VCol cols="12">
                    <VSelect
                      v-model="odc_data.tube"
                      :items="options.tube_color"
                      clearable
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Warna Tube FO <span class="text-error">*</span>
                      </template>
                    </VSelect>
                  </VCol>
                </VRow>
              </VCol>
              <!-- OLT PORT -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odc_data.port"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #prepend-inner>
                    <strong>PON</strong>
                  </template>
                  <template #label>
                    Port OLT <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- DAMPING -->
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="odc_data.damping">
                  <template #label>
                    Redaman <span class="text-error">*</span>
                  </template>
                  <template #append-inner>
                    <strong>DB</strong>
                  </template>
                </VTextField>
              </VCol>
              <!-- CAPACITY -->
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="odc_data.capacity" type="number">
                  <template #label>
                    Kapasitas <span class="text-error">*</span>
                  </template>
                  <template #append-inner>
                    <strong>Core/Port</strong>
                  </template>
                </VTextField>
              </VCol>
              <!-- AVAILABLE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField v-model="odc_data.available" type="number">
                  <template #label>
                    Tersedia <span class="text-error">*</span>
                  </template>
                  <template #append-inner>
                    <strong>Core/Port</strong>
                  </template>
                </VTextField>
              </VCol>
              <!-- ADDRESS -->
              <VCol cols="12">
                <VTextarea
                  v-model="odc_data.location.address"
                  rows="2"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Alamat <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="odc_data.description"
                  label="Deskripsi"
                  rows="2"
                />
              </VCol>
              <!-- LATITUDE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odc_data.location.latitude"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label> Latitude </template>
                </VTextField>
              </VCol>
              <!-- LONGITUDE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odc_data.location.longitude"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label> Longitude </template>
                </VTextField>
              </VCol>
              <!-- GOOGLE MAPS -->
              <VCol cols="12">
                <GoogleMaps
                  height="15em"
                  :lat="odc_data.location.latitude"
                  :lng="odc_data.location.longitude"
                  @update-value="changeLocation"
                />
              </VCol>
              <!-- ACTION BUTTON -->
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
