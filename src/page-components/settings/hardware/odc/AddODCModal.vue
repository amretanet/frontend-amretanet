<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import uploadfile from "@/assets/images/illustrations/uploadfile.png";
import { tube_color_options } from "@/modules/options";

// INTERFACE
interface IEmits {
  (e: "odcAdded"): void;
}

// VARIABLE
const emits = defineEmits<IEmits>();
const image_file = ref(null);
const image_path = ref("");
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  tube_color: tube_color_options,
});
const odc_form = ref<VForm>();
const odc_data = ref({
  name: "",
  image_url: "",
  location: {
    address: "",
    longitude: 0,
    latitude: 0,
  },
  port: 0,
  capacity: 0,
  available: 0,
  damping: "",
  tube: null,
  description: "",
});

// FUNCTION
const uploadImage = (file: any) => {
  return new Promise((resolve, reject) => {
    let form_data = new FormData();
    form_data.append("file", file);
    axiosIns
      .post("utility/upload-image/odc", form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const saveODC = () => {
  odc_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      if (image_file.value) {
        uploadImage(image_file.value).then((res: any) => {
          odc_data.value.image_url = res.file_url;
          saveData();
        });
      } else {
        saveData();
      }
    }
  });
};
const saveData = () => {
  axiosIns
    .post("hardware/odc/add", {
      data: odc_data.value,
    })
    .then(() => {
      emits("odcAdded");
      resetForm();
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
const resetForm = () => {
  odc_form.value?.reset();
  odc_data.value.location.latitude = 0;
  odc_data.value.location.longitude = 0;
  odc_data.value.port = 0;
  odc_data.value.capacity = 0;
  odc_data.value.available = 0;
};
const changeLocation = (data: any) => {
  odc_data.value.location.latitude = data.lat;
  odc_data.value.location.longitude = data.lng;
};
const handleImgError = (event: any) => {
  event.target.src = uploadfile;
};
const previewImage = (e: any) => {
  image_file.value = e?.target?.files[0];
  image_path.value = image_file.value
    ? URL.createObjectURL(image_file.value)
    : " ";
};
const inputImageFile = () => {
  const input_form = document.getElementById("profile-input-image");
  input_form?.click();
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah ODC </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Tambah ODC </template>
        </VCardItem>
        <VCardText>
          <VForm ref="odc_form" @submit.prevent="saveODC">
            <VRow>
              <VCol cols="5">
                <div class="text-center">
                  <div class="clickable" @click="inputImageFile">
                    <img
                      v-if="image_path"
                      :src="image_path"
                      alt="profile"
                      style="height: 100px; max-width: 230px"
                      @error="handleImgError"
                    />
                    <div v-else style="height: 100px; max-width: 230px">
                      <img :src="uploadfile" alt="" style="height: 70px" />
                      <div>Upload Gambar</div>
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
                  label="Keterangan"
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
                    @click="(is_showing_modal = false), resetForm()"
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
