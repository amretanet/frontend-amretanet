<script lang="ts" setup>
import {
  emailValidator,
  integerValidator,
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import {
  confirmAction,
  errorMessage,
  showActionResult,
  thousandSeparator,
  uploadImageFile,
} from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import uploadfile from "@/assets/images/illustrations/uploadfile.png";
import { VForm } from "vuetify/components";
import axiosIns from "@/plugins/axios";
import {
  billing_type_options,
  binner_options,
  customer_status_options,
  due_date_options,
  gender_options,
  house_status_options,
  id_card_type_options,
} from "@/modules/options";

// VARIABLE
const router = useRouter();
const is_on_process = ref(false);
const id_card_image_file = ref<File[]>([]);
const id_card_image_path = ref("");
const house_image_file = ref<File[]>([]);
const house_image_path = ref("");
const customer_form = ref<VForm>();
const customer_data = ref({
  service_number: 0,
  name: null,
  status: 1,
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
  description: null,
  billing_type: null,
  ppn: null,
  due_date: null,
  pppoe_username: null,
  pppoe_password: null,
  id_router: null,
  id_package: null,
  id_add_on_package: [],
  id_coverage_area: null,
  id_odp: null,
  port_odp: null,
});
const options = ref({
  odp: [],
  gender: gender_options,
  house_status: house_status_options,
  id_card: id_card_type_options,
  package: [],
  billing_type: billing_type_options,
  binner_value: binner_options,
  due_date: due_date_options,
  coverage_area: [],
  router: [],
  status: customer_status_options,
});

// FUNCTION
const getNextServiceNumber = () => {
  axiosIns.get("customer/next-service-number").then((res) => {
    customer_data.value.service_number = res?.data?.service_number || 0;
    customer_data.value.pppoe_username = res?.data?.pppoe_username || null;
    customer_data.value.pppoe_password = res?.data?.pppoe_password || null;
  });
};
const getPackageOptions = () => {
  axiosIns.get("options/package").then((res) => {
    options.value.package = res?.data?.package_options || [];
  });
};
const getRouterOptions = () => {
  axiosIns.get("options/router").then((res) => {
    options.value.router = res?.data?.router_options || [];
  });
};
const getODPOptions = () => {
  axiosIns.get("options/odp").then((res) => {
    options.value.odp = res?.data?.odp_options || [];
  });
};
const getCoverageAreaOptions = () => {
  axiosIns.get("options/coverage-area").then((res) => {
    options.value.coverage_area = res?.data?.coverage_area_options || [];
  });
};
const handleImgError = (event: any) => {
  event.target.src = uploadfile;
};
const previewIDCardImage = (e: any) => {
  id_card_image_file.value = e?.target?.files;
  id_card_image_path.value = id_card_image_file.value
    ? URL.createObjectURL(id_card_image_file.value[0])
    : " ";
};
const previewHouseImage = (e: any) => {
  house_image_file.value = e?.target?.files;
  house_image_path.value = house_image_file.value
    ? URL.createObjectURL(house_image_file.value[0])
    : " ";
};
const inputImageFile = (id: string) => {
  const input_form = document.getElementById(id);
  input_form?.click();
};
const validateCustomerForm = async () => {
  customer_form.value?.validate().then((form) => {
    if (form.valid) {
      saveCustomer();
    }
  });
};
const saveCustomer = async () => {
  is_on_process.value = true;
  if (id_card_image_file.value) {
    const image_url = await uploadImageFile(
      id_card_image_file.value[0],
      "id_card_attachment"
    );
    if (image_url) {
      customer_data.value.id_card.image_url = image_url;
    }
  }
  if (house_image_file.value) {
    const house_image_url = await uploadImageFile(
      house_image_file.value[0],
      "house_attachment"
    );
    if (house_image_url) {
      customer_data.value.location.house_image_url = house_image_url;
    }
  }
  axiosIns
    .post("customer/add", {
      data: customer_data.value,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Pelanggan Telah Ditambahkan!");
      router.push("/managements/customer");
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(true, "error", message);
    })
    .finally(() => {
      is_on_process.value = false;
    });
};
const resetForm = async () => {
  const is_confirmed = await confirmAction(
    "Reset Formulir?",
    "Formulir pendaftaran pelanggan akan di reset",
    "Ya, Reset!"
  );
  if (is_confirmed) {
    customer_form.value?.reset();
  }
};
const changeLocation = (data: any) => {
  customer_data.value.location.latitude = data.lat;
  customer_data.value.location.longitude = data.lng;
};

// LIFECYCLE HOOKS
onMounted(() => {
  getNextServiceNumber();
  getRouterOptions();
  getPackageOptions();
  getODPOptions();
  getCoverageAreaOptions();
});
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-user-plus" />
      </template>
      <template #title> Formulir Pendaftaran Pelanggan </template>
      <template #append>
        <VBtn
          variant="text"
          prepend-icon="tabler-arrow-left"
          :to="{ name: 'managements-customer' }"
        >
          Kembali
        </VBtn>
      </template>
    </VCardItem>
    <VCardText>
      <VForm ref="customer_form" @submit.prevent="validateCustomerForm">
        <VRow>
          <VCol cols="12" md="6" sm="12">
            <VRow>
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="customer_data.service_number"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nomor Layanan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="8" sm="12">
                <VTextField
                  v-model="customer_data.name"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Pelanggan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- IMAGE ID -->
              <VCol cols="12" md="5" sm="12">
                <div class="text-center">
                  <div
                    class="clickable"
                    @click="inputImageFile('id-card-image')"
                  >
                    <img
                      v-if="id_card_image_path"
                      :src="id_card_image_path"
                      alt="id_card"
                      class="rounded-lg"
                      style="
                        width: 100%;
                        max-height: 180px;
                        object-fit: contain;
                      "
                      @error="handleImgError"
                    />
                    <div
                      v-else
                      class="border border-primary border-md bg-light-info border-dashed rounded-lg"
                      style="height: 170px"
                    >
                      <img
                        :src="uploadfile"
                        alt="uploadfile"
                        class="mt-10"
                        style="height: 60px"
                      />
                      <div>Upload Kartu Identitas</div>
                    </div>
                  </div>
                  <!-- PROFILE INPUT -->
                  <div class="id-card mt-2 d-flex">
                    <input
                      type="file"
                      id="id-card-image"
                      accept="image/*"
                      @change="previewIDCardImage"
                      style="display: none"
                    />
                  </div>
                </div>
              </VCol>
              <!-- ID CARD -->
              <VCol cols="12" md="7" sm="12">
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      v-model="customer_data.id_card.type"
                      :items="options.id_card"
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Jenis Kartu Identitas <span class="text-error">*</span>
                      </template>
                    </VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      v-model="customer_data.id_card.number"
                      :rules="[requiredValidator, integerValidator]"
                    >
                      <template #label>
                        Nomor Kartu Identitas <span class="text-error">*</span>
                      </template>
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
                </VRow>
              </VCol>
              <!-- EMAIL -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.email"
                  :rules="[requiredValidator, emailValidator]"
                >
                  <template #label>
                    Email <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PHONE NUMBER -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.phone_number"
                  :rules="[requiredValidator, phoneNumberValidator]"
                >
                  <template #prepend-inner> +62 </template>
                  <template #label>
                    Nomor Telepon <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- STATUS -->
              <VCol cols="12" md="6" sm="12">
                <VSelect
                  v-model="customer_data.status"
                  :items="options.status"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Status Pelanggan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- HOUSE STATUS -->
              <VCol cols="12" md="6" sm="12">
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
              <!-- HOUSE -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="12" md="5">
                    <div class="text-center">
                      <div
                        class="clickable"
                        @click="inputImageFile('house-image')"
                      >
                        <img
                          v-if="house_image_path"
                          :src="house_image_path"
                          alt="house"
                          class="rounded-lg"
                          style="
                            width: 100%;
                            max-height: 180px;
                            object-fit: contain;
                          "
                          @error="handleImgError"
                        />
                        <div
                          v-else
                          class="border border-primary border-md bg-light-info border-dashed rounded-lg"
                          style="height: 170px"
                        >
                          <img
                            :src="uploadfile"
                            alt="uploadfile"
                            class="mt-10"
                            style="height: 60px"
                          />
                          <div>Upload Foto Rumah</div>
                        </div>
                      </div>
                      <!-- PROFILE INPUT -->
                      <div class="house mt-2 d-flex">
                        <input
                          type="file"
                          id="house-image"
                          accept="image/*"
                          @change="previewHouseImage"
                          style="display: none"
                        />
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" md="7">
                    <VRow>
                      <!-- HOUSE OWNER -->
                      <VCol cols="12">
                        <VTextField
                          v-model="customer_data.location.house_owner"
                          :rules="[requiredValidator]"
                        >
                          <template #label>
                            Nama Pemilik Rumah <span class="text-error">*</span>
                          </template>
                        </VTextField>
                      </VCol>
                      <!-- ADDRESS -->
                      <VCol cols="12">
                        <VTextarea
                          v-model="customer_data.location.address"
                          rows="4"
                          :rules="[requiredValidator]"
                        >
                          <template #label>
                            Alamat Singkat <span class="text-error">*</span>
                          </template>
                        </VTextarea>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VCol>
              <!-- DESCRIPTIONS -->
              <VCol cols="12">
                <VTextarea
                  v-model="customer_data.description"
                  rows="5"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Deskripsi Singkat <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VRow>
              <!-- PACKAGE -->
              <VCol cols="12" md="7" sm="12">
                <VSelect
                  v-model="customer_data.id_package"
                  :items="options.package.filter((el:any)=>el.category ==='PPPOE')"
                  :rules="[requiredValidator]"
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
                          <VChip
                            size="x-small"
                            variant="outlined"
                            color="warning"
                          >
                            {{ item?.raw?.bandwidth }} Mbps
                          </VChip>
                          <VChip size="x-small" variant="outlined" color="dark">
                            Rp{{
                              thousandSeparator(item?.raw?.price.regular || 0)
                            }}
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VSelect>
              </VCol>
              <!-- BILLING TYPE -->
              <VCol cols="12" md="5" sm="12">
                <VSelect
                  v-model="customer_data.billing_type"
                  :items="options.billing_type"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Jenis Tagihan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- ADD ON PACKAGE -->
              <VCol cols="12" md="12" sm="12">
                <VSelect
                  v-model="customer_data.id_add_on_package"
                  :items="options.package.filter((el:any)=>el.category ==='ADD-ONS')"
                  chips
                  :multiple="true"
                  clearable
                  closable-chips
                >
                  <template #label> Paket Tambahan </template>
                  <template v-slot:item="{ props, item }">
                    <VListItem v-bind="props" class="px-2">
                      <template #title>
                        <span class="fs-14">
                          {{ item?.raw?.title }}
                        </span>
                      </template>
                      <template #subtitle>
                        <div class="d-flex gap-1">
                          <VChip
                            v-if="item?.raw?.bandwidth"
                            size="x-small"
                            variant="outlined"
                            color="warning"
                          >
                            {{ item?.raw?.bandwidth }} Mbps
                          </VChip>
                          <VChip size="x-small" variant="outlined" color="dark">
                            Rp{{
                              thousandSeparator(item?.raw?.price.regular || 0)
                            }}
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VSelect>
              </VCol>
              <!-- PPN -->
              <VCol cols="12" md="5" sm="12">
                <VSelect
                  v-model="customer_data.ppn"
                  :items="options.binner_value"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Status PPN <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- DUE DATE -->
              <VCol cols="12" md="7">
                <VSelect
                  v-model="customer_data.due_date"
                  :items="options.due_date"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Jatuh Tempo <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- ROUTER -->
              <VCol cols="12" md="6" sm="12">
                <VSelect
                  v-model="customer_data.id_router"
                  :items="options.router"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Router <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- COVERAGE AREA -->
              <VCol cols="12" md="6" sm="12">
                <VSelect
                  v-model="customer_data.id_coverage_area"
                  :items="options.coverage_area"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Coverage Area <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- ODP -->
              <VCol cols="12" md="7" sm="12">
                <VSelect
                  v-model="customer_data.id_odp"
                  :items="options.odp"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    ODP <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- ODP PORT -->
              <VCol cols="12" md="5" sm="12">
                <VTextField
                  v-model="customer_data.port_odp"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Port ODP <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PPPOE USERNAME -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.pppoe_username"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Username PPPOE <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- PPPOE PASSWORD -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.pppoe_password"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Password PPPOE <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- LATITUDE -->
              <VCol cols="12" md="6" sm="12">
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
              <VCol cols="12" md="6" sm="12">
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
              <VCol cols="12">
                <GoogleMaps
                  height="296px"
                  :lat="customer_data.location.latitude"
                  :lng="customer_data.location.longitude"
                  @update-value="changeLocation"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12">
            <div class="d-flex gap-2 justify-end">
              <VBtn size="default" color="warning" @click="resetForm">
                Reset
              </VBtn>
              <ProcessButton
                :is_on_process="is_on_process"
                size="default"
                type="submit"
                :disabled="is_on_process"
              />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
