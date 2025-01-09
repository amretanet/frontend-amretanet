<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import {
  errorMessage,
  getLocation,
  showActionResult,
  uploadImageFile,
} from "@/modules";
import { ticket_status_options, tube_color_options } from "@/modules/options";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "ticketClosed"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  tube: tube_color_options,
  user: [],
  odp: [],
  odc: [],
  status: ticket_status_options,
  title: [],
  hardware: [],
});
const ticket_form = ref<VForm>();
const ticket_data = ref({
  type: props?.data?.type || null,
  name: props?.data?.name || null,
  id_odc: props?.data?.id_odc || null,
  id_odp: props?.data?.id_odp || null,
  tube: null,
  cable: 0,
  hardware: null,
  serial_number: null,
  re_odp: 0,
  re_ont: 0,
  odp_image: [] as File[],
  ont_image: [] as File[],
  serial_number_image: [] as File[],
  house_image: [] as File[],
  ont_position_image: [] as File[],
  customer_image: [] as File[],
  other_image: [] as File[],
  location: {
    latitude: null,
    longitude: null,
  },
  confirm_message: null,
});

// FUNCTION
const getHardwareOptions = () => {
  axiosIns.get("options/hardware").then((res) => {
    options.value.hardware = res.data.hardware_options || [];
  });
};
const getTicketTitleOptions = () => {
  axiosIns.get("options/ticket-title").then((res) => {
    options.value.title = res.data.ticket_title_options || [];
  });
};
const getUserOptions = () => {
  axiosIns.get("options/user").then((res) => {
    options.value.user = res.data.user_options || [];
  });
};
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
const getCurrentLocation = async () => {
  try {
    const position: any = await getLocation();
    ticket_data.value.location.latitude = position?.coords?.latitude || 0;
    ticket_data.value.location.longitude = position?.coords?.longitude || 0;
  } catch {
    showActionResult(
      undefined,
      "error",
      "Gagal Mendapatkan Lokasi! Mohon Untuk Mengizinkan Akses Lokasi"
    );
  }
};
const changeLocation = (data: any) => {
  ticket_data.value.location.latitude = data.lat;
  ticket_data.value.location.longitude = data.lng;
};
const validateTicketForm = async () => {
  ticket_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      closeTicket();
    }
  });
};
const closeTicket = async () => {
  is_on_process.value = true;
  let params = {
    id_odc: ticket_data.value.id_odc,
    id_odp: ticket_data.value.id_odp,
    tube: ticket_data.value.tube,
    cable: ticket_data.value.cable,
    hardware: ticket_data.value.hardware,
    serial_number: ticket_data.value.serial_number,
    re_odp: ticket_data.value.re_odp,
    re_ont: ticket_data.value.re_ont,
    evidence: {
      odp_image_url: null,
      ont_image_url: null,
      serial_number_image_url: null,
      house_image_url: null,
      ont_position_image_url: null,
      customer_image_url: null,
      other_image_url: null,
    },
    location: {
      latitude: ticket_data.value.location.latitude,
      longitude: ticket_data.value.location.longitude,
    },
    confirm_message: ticket_data.value.confirm_message,
  };
  if (ticket_data.value.odp_image.length > 0) {
    const odp_image_url = await uploadImageFile(
      ticket_data.value.odp_image[0],
      "ticket_attachment"
    );
    params.evidence.odp_image_url = odp_image_url;
  }
  if (ticket_data.value.ont_image.length > 0) {
    const ont_image_url = await uploadImageFile(
      ticket_data.value.ont_image[0],
      "ticket_attachment"
    );
    params.evidence.ont_image_url = ont_image_url;
  }
  if (ticket_data.value.ont_position_image.length > 0) {
    const ont_position_image_url = await uploadImageFile(
      ticket_data.value.ont_position_image[0],
      "ticket_attachment"
    );
    params.evidence.ont_position_image_url = ont_position_image_url;
  }
  if (ticket_data.value.serial_number_image.length > 0) {
    const serial_number_image_url = await uploadImageFile(
      ticket_data.value.serial_number_image[0],
      "ticket_attachment"
    );
    params.evidence.serial_number_image_url = serial_number_image_url;
  }
  if (ticket_data.value.house_image.length > 0) {
    const house_image_url = await uploadImageFile(
      ticket_data.value.house_image[0],
      "ticket_attachment"
    );
    params.evidence.house_image_url = house_image_url;
  }
  if (ticket_data.value.customer_image.length > 0) {
    const customer_image_url = await uploadImageFile(
      ticket_data.value.customer_image[0],
      "ticket_attachment"
    );
    params.evidence.customer_image_url = customer_image_url;
  }
  if (ticket_data.value.other_image.length > 0) {
    const other_image_url = await uploadImageFile(
      ticket_data.value.other_image[0],
      "ticket_attachment"
    );
    params.evidence.other_image_url = other_image_url;
  }
  axiosIns
    .put(`ticket/close/${props.data._id}`, {
      data: params,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Tiket Telah Ditutup!");
      emits("ticketClosed");
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

// LIFECYCLE HOOKS
watch(props, () => {
  ticket_data.value.type = props?.data?.type || null;
  ticket_data.value.name = props?.data?.name || null;
  ticket_data.value.id_odc = props?.data?.id_odc || null;
  ticket_data.value.id_odp = props?.data?.id_odp || null;
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getTicketTitleOptions();
    getUserOptions();
    getODCOptions();
    getODPOptions();
    getHardwareOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" prepend-icon="mdi-progress-check">
          <VTooltip activator="parent"> Tutup Tiket </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="600" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="mdi-progress-check" />
          </template>
          <template #title>
            Tutup Tiket ({{ ticket_data?.name || "-" }})
          </template>
        </VCardItem>
        <VCardText>
          <VForm ref="ticket_form" @submit.prevent="validateTicketForm">
            <VRow>
              <!-- ODC -->
              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="ticket_data.id_odc"
                  :items="options.odc"
                  clearable
                >
                  <template #label> ODC </template>
                </VAutocomplete>
              </VCol>
              <!-- ODP -->
              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="ticket_data.id_odp"
                  :items="options.odp"
                  clearable
                >
                  <template #label> ODP </template>
                </VAutocomplete>
              </VCol>
              <!-- TUBE/CORE -->
              <VCol cols="12" md="7">
                <VAutocomplete v-model="ticket_data.tube" :items="options.tube">
                  <template #label> Warna /Core (FOM) </template>
                </VAutocomplete>
              </VCol>
              <!-- CABLE -->
              <VCol cols="12" md="5">
                <VTextField v-model="ticket_data.cable" type="number">
                  <template #label> Kabel </template>
                  <template #append-inner> Meter </template>
                </VTextField>
              </VCol>
              <!-- HARDWARE -->
              <VCol cols="12" md="6">
                <VCombobox
                  v-model="ticket_data.hardware"
                  label="Perangkat"
                  :items="options.hardware"
                  clearable
                />
              </VCol>
              <!-- SERIAL NUMBER -->
              <VCol cols="12" md="6">
                <VTextField v-model="ticket_data.serial_number">
                  <template #label> Serial Number/ Mac Address </template>
                </VTextField>
              </VCol>
              <!-- DUMPING BEFORE -->
              <VCol cols="12" md="6">
                <VTextField v-model="ticket_data.re_odp" type="number">
                  <template #label> Redaman Awal (IN/ODP) </template>
                  <template #append-inner> dB </template>
                </VTextField>
              </VCol>
              <!-- DUMPING AFTER -->
              <VCol cols="12" md="6">
                <VTextField v-model="ticket_data.re_ont" type="number">
                  <template #label> Redaman Akhir (OUT/ONT) </template>
                  <template #append-inner> dB </template>
                </VTextField>
              </VCol>
              <!-- ODP IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput v-model="ticket_data.odp_image" accept="image/*">
                  <template #label> Foto ODP </template>
                </VFileInput>
              </VCol>
              <!-- ONT IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput v-model="ticket_data.ont_image" accept="image/*">
                  <template #label> Foto ONT </template>
                </VFileInput>
              </VCol>
              <!-- SN/MAC IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput
                  v-model="ticket_data.serial_number_image"
                  accept="image/*"
                >
                  <template #label> Foto SN/MAC </template>
                </VFileInput>
              </VCol>
              <!-- ONT POSITION IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput
                  v-model="ticket_data.ont_position_image"
                  accept="image/*"
                >
                  <template #label> Foto Posisi ONT </template>
                </VFileInput>
              </VCol>
              <!-- HOUSE IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput v-model="ticket_data.house_image" accept="image/*">
                  <template #label> Foto Rumah (Depan) </template>
                </VFileInput>
              </VCol>
              <!-- CUSTOMER IMAGE -->
              <VCol cols="12" md="6">
                <VFileInput
                  v-model="ticket_data.customer_image"
                  accept="image/*"
                >
                  <template #label> Foto Pelanggan </template>
                </VFileInput>
              </VCol>
              <!-- OTHER IMAGE -->
              <VCol cols="12">
                <VFileInput v-model="ticket_data.other_image" accept="image/*">
                  <template #label> Foto Lainnya </template>
                </VFileInput>
              </VCol>
              <!-- LATITUDE -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="ticket_data.location.latitude"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Latitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- LONGITUDE -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="ticket_data.location.longitude"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    longitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- LOCATION -->
              <VCol cols="12">
                <GoogleMaps
                  height="250px"
                  :lat="ticket_data.location.latitude"
                  :lng="ticket_data.location.longitude"
                  @update-value="changeLocation"
                />
                <VBtn
                  block
                  size="small"
                  color="success"
                  prepend-icon="tabler-map-pin"
                  class="mt-2"
                  @click="getCurrentLocation()"
                >
                  Lokasi Saat Ini
                </VBtn>
              </VCol>
              <!-- CONFIRM MESSAGE -->
              <VCol cols="12">
                <VTextarea
                  v-model="ticket_data.confirm_message"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Keterangan <span class="text-error">*</span>
                  </template>
                </VTextarea>
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
