<script lang="ts" setup>
import {
  emailValidator,
  integerValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import {
  errorMessage,
  getLocation,
  showActionResult,
  thousandSeparator,
  uploadImageFile,
} from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import { VForm } from "vuetify/components";
import axiosIns from "@/plugins/axios";
import {
  gender_options,
  house_status_options,
  id_card_type_options,
} from "@/modules/options";

// VARIABLE
const router = useRouter();
const current_step = ref(0);
const is_aggree = ref(false);
const is_on_process = ref(false);
const id_card_image_file = ref<File[]>([]);
const house_image_file = ref<File[]>([]);
const customer_form = ref<VForm>();
const customer_data = ref({
  name: null,
  id_card: {
    type: null,
    number: null,
    image_url: null,
  },
  gender: null,
  email: null,
  phone_number: null,
  location: {
    house_status: null,
    house_owner: null,
    house_image_url: null,
    address: null,
    latitude: null,
    longitude: null,
  },
  id_package: null,
  instalation_date: null,
});
const options = ref({
  gender: gender_options,
  house_status: house_status_options,
  id_card: id_card_type_options,
  package: [],
});

// FUNCTION
const getPackageOptions = () => {
  axiosIns.get("options/package").then((res) => {
    options.value.package = res?.data?.package_options || [];
  });
};
const validateCustomerForm = () => {
  customer_form.value?.validate().then((form) => {
    if (form.valid) {
      is_on_process.value = true;
      registerCustomer();
      is_on_process.value = false;
    }
  });
};
const registerCustomer = async () => {
  if (id_card_image_file.value && house_image_file.value) {
    try {
      const id_card_url = await uploadImageFile(
        id_card_image_file.value[0],
        "id_card_attachment"
      );
      const house_url = await uploadImageFile(
        house_image_file.value[0],
        "house_attachment"
      );
      customer_data.value.id_card.image_url = id_card_url || "";
      customer_data.value.location.house_image_url = house_url || "";
      axiosIns
        .post("customer/register", {
          data: customer_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Pendaftaran Telah Diajukan!");
          router.push({ name: "login" });
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
        });
    } catch (error) {
      showActionResult(undefined, "error", "Proses Upload Gambar Gagal!");
      is_on_process.value = false;
    }
  }
};
const getCurrentLocation = async () => {
  try {
    const position: any = await getLocation();
    customer_data.value.location.latitude = position?.coords?.latitude || 0;
    customer_data.value.location.longitude = position?.coords?.longitude || 0;
  } catch {
    showActionResult(
      undefined,
      "error",
      "Gagal Mendapatkan Lokasi! Mohon Untuk Mengizinkan Akses Lokasi"
    );
  }
};
const changeLocation = (data: any) => {
  customer_data.value.location.latitude = data.lat;
  customer_data.value.location.longitude = data.lng;
};
const checkFormFilled = (step: number) => {
  if (current_step.value <= step) {
    current_step.value = step;
  }
};

// LIFECYCLE HOOKS
onMounted(() => {
  getPackageOptions();
});
</script>

<template>
  <VForm ref="customer_form" @submit.prevent="validateCustomerForm">
    <VRow class="scroller" style="max-height: 35vh">
      <!-- NAME -->
      <VCol cols="12">
        <VTextField v-model="customer_data.name" :rules="[requiredValidator]">
          <template #label> Nama <span class="text-error">*</span> </template>
        </VTextField>
      </VCol>
      <!-- GENDER -->
      <VCol cols="12">
        <VSelect
          v-model="customer_data.gender"
          :items="options.gender"
          :rules="[requiredValidator]"
        >
          <template #label>
            Jenis Kelamin <span class="text-error">*</span>
          </template>
        </VSelect>
      </VCol>
      <!-- PHONE NUMBER -->
      <VCol cols="12">
        <VTextField
          v-model="customer_data.phone_number"
          :rules="[requiredValidator, phoneNumberValidator]"
          @update:model-value="
            phoneNumberValidator(customer_data.phone_number) == true
              ? checkFormFilled(3)
              : ''
          "
        >
          <template #prepend-inner> +62 </template>
          <template #label>
            Nomor Telepon <span class="text-error">*</span>
          </template>
        </VTextField>
      </VCol>
      <!-- EMAIL -->
      <VCol v-if="current_step >= 3" cols="12">
        <VTextField
          v-model="customer_data.email"
          :rules="[requiredValidator, emailValidator]"
          @update:model-value="
            emailValidator(customer_data.email) == true
              ? checkFormFilled(4)
              : ''
          "
        >
          <template #label> Email <span class="text-error">*</span> </template>
        </VTextField>
      </VCol>
      <!-- ID CARD NUMBER -->
      <VCol v-if="current_step >= 4" cols="12" md="6" sm="12">
        <VTextField
          v-model="customer_data.id_card.number"
          :rules="[requiredValidator, integerValidator]"
        >
          <template #label>
            Nomor Kartu Identitas <span class="text-error">*</span>
          </template>
        </VTextField>
      </VCol>
      <!-- ID CARD TYPE -->
      <VCol v-if="current_step >= 4" cols="12" md="6" sm="12">
        <VSelect
          v-model="customer_data.id_card.type"
          :items="options.id_card"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(5)"
        >
          <template #label>
            Jenis Kartu Identitas <span class="text-error">*</span>
          </template>
        </VSelect>
      </VCol>
      <!-- ID CARD IMAGE -->
      <VCol v-if="current_step >= 5" cols="12">
        <VFileInput
          v-model="id_card_image_file"
          accept="image/*"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(6)"
        >
          <template #label>
            Foto Kartu Identitas <span class="text-error">*</span>
          </template>
        </VFileInput>
      </VCol>
      <!-- HOUSE STATUS -->
      <VCol v-if="current_step >= 6" cols="12" md="5" sm="12">
        <VSelect
          v-model="customer_data.location.house_status"
          :items="options.house_status"
          :rules="[requiredValidator]"
        >
          <template #label>
            Status Rumah <span class="text-error">*</span>
          </template>
        </VSelect>
      </VCol>
      <!-- HOUSE OWNER -->
      <VCol v-if="current_step >= 6" cols="12" md="7" sm="12">
        <VTextField
          v-model="customer_data.location.house_owner"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(7)"
        >
          <template #label>
            Nama Pemilik Rumah <span class="text-error">*</span>
          </template>
        </VTextField>
      </VCol>
      <!-- HOUSE ADDRESS -->
      <VCol v-if="current_step >= 7" cols="12">
        <VTextarea
          v-model="customer_data.location.address"
          rows="2"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(8)"
        >
          <template #label>
            Alamat Singkat <span class="text-error">*</span>
          </template>
        </VTextarea>
      </VCol>
      <!-- HOUSE IMAGE -->
      <VCol v-if="current_step >= 8" cols="12">
        <VFileInput
          v-model="house_image_file"
          accept="image/*"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(9)"
        >
          <template #label>
            Foto Rumah Tampak Depan <span class="text-error">*</span>
          </template>
        </VFileInput>
      </VCol>
      <!-- LATITUDE -->
      <VCol v-if="current_step >= 9" cols="12" md="6" sm="12">
        <VTextField
          v-model="customer_data.location.latitude"
          type="number"
          :rules="[requiredValidator]"
        >
          <template #label>
            Latitude <span class="text-error">*</span>
          </template>
        </VTextField>
      </VCol>
      <!-- LONGITUDE -->
      <VCol v-if="current_step >= 9" cols="12" md="6" sm="12">
        <VTextField
          v-model="customer_data.location.longitude"
          type="number"
          :rules="[requiredValidator]"
        >
          <template #label>
            longitude <span class="text-error">*</span>
          </template>
        </VTextField>
      </VCol>
      <!-- GOOGLE MAPS -->
      <VCol v-if="current_step >= 9" cols="12" id="printed-content">
        <GoogleMaps
          height="296px"
          :lat="customer_data.location.latitude"
          :lng="customer_data.location.longitude"
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
      <!-- PACKAGE -->
      <VCol v-if="current_step >= 9" cols="12">
        <VSelect
          v-model="customer_data.id_package"
          :items="options.package.filter((el:any)=>el.category ==='PPPOE')"
          :rules="[requiredValidator]"
          @update:model-value="checkFormFilled(10)"
        >
          <template #label>
            Paket Internet <span class="text-error">*</span>
          </template>
          <template v-slot:item="{ props, item }">
            <VListItem v-bind="props" class="px-2">
              <template #title>
                <span class="fs-14">
                  {{ item?.raw?.title }}
                </span>
              </template>
              <template #subtitle>
                <div class="d-flex gap-1">
                  <VChip size="x-small" variant="outlined" color="warning">
                    {{ item?.raw?.bandwidth }} Mbps
                  </VChip>
                  <VChip size="x-small" variant="outlined" color="dark">
                    Rp{{ thousandSeparator(item?.raw?.price.regular || 0) }}
                  </VChip>
                </div>
              </template>
            </VListItem>
          </template>
        </VSelect>
      </VCol>
      <!-- INSTALATION DATE -->
      <VCol v-if="current_step >= 10" cols="12">
        <AppDateTimePicker
          v-model="customer_data.instalation_date"
          label="Tanggal Pemasangan"
          append-inner-icon="tabler-calendar"
          @update:model-value="checkFormFilled(11)"
        />
        <div class="mt-2 fs-14 text-justify text-disabled">
          Waktu yang dipilih hanya estimasi pemasangan. Selanjutnya akan
          dikonfirmasi oleh Teknisi
        </div>
      </VCol>
    </VRow>
    <div class="d-flex flex-column gap-2 mt-5">
      <div class="d-flex gap-2 align-bottom">
        <VCheckbox v-model="is_aggree" />
        <div class="fs-14 mt-2 text-justify">
          Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi yang berlaku
        </div>
      </div>
      <div>
        <ProcessButton
          text="Daftar Sekarang"
          :is_on_process="is_on_process"
          size="default"
          color="primary"
          type="submit"
          block
          :disabled="is_on_process || !is_aggree"
        />
      </div>
    </div>
  </VForm>
</template>
