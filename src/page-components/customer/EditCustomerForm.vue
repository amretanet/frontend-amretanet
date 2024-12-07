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
} from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import uploadfile from "@/assets/images/illustrations/uploadfile.png";
import { VForm } from "vuetify/components";
import axiosIns from "@/plugins/axios";
import {
  billing_type_options,
  binner_options,
  due_date_options,
  gender_options,
  house_status_options,
  id_card_type_options,
} from "@/modules/options";

// VARIABLE
const routes = useRoute();
const router = useRouter();
const is_on_process = ref(false);
const image_file = ref(null);
const image_path = ref("");
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
    address: null,
    latitude: null,
    longitude: null,
  },
  description: null,
  billing_type: null,
  ppn: null,
  due_date: null,
  add_on_package: [],
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
});

// FUNCTION
const getCustomerData = () => {
  if (routes.query.id) {
    try {
      const id_customer = atob(routes.query.id.toString());
      axiosIns
        .get(`customer/detail/${id_customer}`)
        .then((res) => {
          customer_data.value = res.data.customer_data;
          image_path.value = res?.data?.customer_data?.id_card?.image_url || "";
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(undefined, "error", message);
        });
    } catch {
      showActionResult(undefined, "error", "Format ID Tidak Sesuai!");
    }
  }
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
const uploadImage = (file: any) => {
  return new Promise((resolve, reject) => {
    let form_data = new FormData();
    form_data.append("file", file);
    axiosIns
      .post("utility/upload-image/id_card", form_data, {
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
const updateCustomer = () => {
  customer_form.value?.validate().then((form) => {
    if (form.valid) {
      is_on_process.value = true;
      if (image_file.value) {
        uploadImage(image_file.value).then((res: any) => {
          customer_data.value.id_card.image_url = res.file_url;
          updateData();
        });
      } else {
        updateData();
      }
    }
  });
};
const updateData = () => {
  if (routes.query.id && atob(routes.query.id.toString())) {
    axiosIns
      .put(`customer/update/${atob(routes.query.id?.toString())}`, {
        data: customer_data.value,
      })
      .then(() => {
        showActionResult(undefined, undefined, "Data Pelanggan Telah Diubah!");
        router.push("/managements/customer");
      })
      .catch((err) => {
        const message = errorMessage(err);
        showActionResult(true, "error", message);
      })
      .finally(() => {
        is_on_process.value = false;
      });
  } else {
    showActionResult(undefined, "error", "ID Pelanggan Tidak Ditemukan!");
  }
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
  getCustomerData();
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
        <VIcon icon="tabler-user-edit" />
      </template>
      <template #title> Formulir Perubahan Data Pelanggan </template>
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
      <VForm ref="customer_form" @submit.prevent="updateCustomer">
        <VRow>
          <VCol cols="12" md="6" sm="12">
            <VRow>
              <!-- IMAGE ID -->
              <VCol cols="12" md="5" sm="12">
                <div class="text-center">
                  <div class="clickable" @click="inputImageFile">
                    <img
                      v-if="image_path"
                      :src="image_path"
                      alt="profile"
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
              <!-- NAME -->
              <VCol cols="12" md="7" sm="12">
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      v-model="customer_data.name"
                      :rules="[requiredValidator]"
                    >
                      <template #label>
                        Nama Pelanggan <span class="text-error">*</span>
                      </template>
                    </VTextField>
                  </VCol>
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
                </VRow>
              </VCol>
              <!-- GENDER -->
              <VCol cols="12" md="5" sm="12">
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
              <!-- EMAIL -->
              <VCol cols="12" md="7" sm="12">
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
                    No Telp/Whatsapp <span class="text-error">*</span>
                  </template>
                </VTextField>
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
                  rows="5"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Alamat Singkat <span class="text-error">*</span>
                  </template>
                </VTextarea>
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
              <!-- ADD ONS PACKAGE -->
              <VCol cols="12" md="12" sm="12">
                <VSelect
                  v-model="customer_data.id_add_on_package"
                  :items="options.package.filter((el:any)=>el.category ==='ADD-ONS')"
                  :multiple="true"
                  chips
                  closable-chips
                  clearable
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
                    Status PPN 11% <span class="text-error">*</span>
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
              <VBtn size="small" color="warning" @click="resetForm">
                Reset
              </VBtn>
              <ProcessButton
                :is_on_process="is_on_process"
                size="small"
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
