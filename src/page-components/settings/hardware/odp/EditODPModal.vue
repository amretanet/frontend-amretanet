<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult, uploadImageFile } from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";
import uploadfile from "@/assets/images/illustrations/uploadfile.png";
import { topology_options, tube_color_options } from "@/modules/options";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "odpUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const image_file = ref<File[]>([]);
const image_path = ref(props.data.image_url || "");
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  odp: [],
  odc: [],
  tube_color: tube_color_options,
  topology: topology_options,
});
const odp_form = ref<VForm>();
const odp_data = ref({
  id_parent: props.data.id_parent || null,
  name: props.data.name || "",
  topology: props.data.topology || null,
  image_url: props.data.image_url || "",
  location: {
    address: props.data.location.address || "",
    longitude: props.data.location.longitude || 0,
    latitude: props.data.location.latitude || 0,
  },
  port: props.data.port || 0,
  capacity: props.data.capacity || 0,
  available: props.data.available || 0,
  damping: props.data.damping || null,
  tube: props.data.tube || null,
  description: props.data.description || "",
});

// FUNCTION
const getODCOptions = () => {
  axiosIns.get("options/odc").then((res) => {
    options.value.odc = res.data.odc_options || [];
  });
};
const getODPOptions = () => {
  axiosIns.get("options/odp").then((res) => {
    options.value.odp = res.data.odp_options || [];
  });
};
const validateODPForm = async () => {
  odp_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      updateODP();
    }
  });
};
const updateODP = async () => {
  is_on_process.value = true;
  if (image_file.value.length > 0) {
    const image_url = await uploadImageFile(
      image_file.value[0],
      "odp_attachment"
    );
    if (image_url) {
      odp_data.value.image_url = image_url;
    }
  }
  axiosIns
    .put(`odp/update/${props.data._id}`, {
      data: odp_data.value,
    })
    .then(() => {
      showActionResult(undefined, undefined, "ODP Telah Diubah!");
      emits("odpUpdated");
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
  odp_data.value.location.latitude = data.lat;
  odp_data.value.location.longitude = data.lng;
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
  odp_data.value = {
    id_parent: props.data.id_parent || null,
    name: props.data.name || "",
    topology: props.data.topology || null,
    image_url: props.data.image_url || "",
    location: {
      address: props.data.location.address || "",
      longitude: props.data.location.longitude || 0,
      latitude: props.data.location.latitude || 0,
    },
    port: props.data.port || 0,
    capacity: props.data.capacity || 0,
    available: props.data.available || 0,
    damping: props.data.damping || null,
    tube: props.data.tube || null,
    description: props.data.description || "",
  };
  image_path.value = props.data.image_url || "";
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getODCOptions();
    getODPOptions();
  }
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
          <template #title> Edit ODP </template>
        </VCardItem>
        <VCardText>
          <VForm ref="odp_form" @submit.prevent="validateODPForm">
            <VRow>
              <!-- IMAGE -->
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
              <!-- NAME & TUBE COLOR -->
              <VCol cols="7">
                <VRow>
                  <!-- NAME -->
                  <VCol cols="12">
                    <VTextField
                      v-model="odp_data.name"
                      clearable
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Nama/Kode ODP <span class="text-error">*</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <!-- TUBE COLOR -->
                  <VCol cols="12">
                    <VSelect
                      v-model="odp_data.tube"
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
              <!-- TOPOLOGY -->
              <VCol cols="12" :md="odp_data.topology ? '4' : '12'" sm="12">
                <VSelect
                  v-model="odp_data.topology"
                  :items="options.topology"
                  @update:model-value="odp_data.id_parent = null"
                >
                  <template #label> Topologi </template>
                </VSelect>
              </VCol>
              <!-- ODC -->
              <VCol v-if="odp_data.topology" cols="12" md="8" sm="12">
                <VAutocomplete
                  v-if="odp_data.topology === 'STAR'"
                  v-model="odp_data.id_parent"
                  :items="options.odc"
                >
                  <template #label> Nama/Kode ODC </template>
                </VAutocomplete>
                <VAutocomplete
                  v-if="odp_data.topology === 'TREE'"
                  v-model="odp_data.id_parent"
                  :items="options.odp.filter((el:any)=>el.title !== odp_data.name)"
                >
                  <template #label> Nama/Kode ODP </template>
                </VAutocomplete>
              </VCol>
              <!-- OLT PORT -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odp_data.port"
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
                <VTextField v-model="odp_data.damping">
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
                <VTextField v-model="odp_data.capacity" type="number">
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
                <VTextField v-model="odp_data.available" type="number">
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
                  v-model="odp_data.location.address"
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
                  v-model="odp_data.description"
                  label="Deskripsi"
                  rows="2"
                />
              </VCol>
              <!-- LATITUDE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odp_data.location.latitude"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label> Latitude </template>
                </VTextField>
              </VCol>
              <!-- LONGITUDE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="odp_data.location.longitude"
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
                  :lat="odp_data.location.latitude"
                  :lng="odp_data.location.longitude"
                  @update-value="changeLocation"
                />
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      size="default"
                      block
                      color="error"
                      @click="is_showing_modal = false"
                    >
                      Batal
                    </VBtn>
                  </VCol>
                  <VCol cols="6">
                    <ProcessButton
                      :is_on_process="is_on_process"
                      size="default"
                      block
                      type="submit"
                      :disabled="is_on_process"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
