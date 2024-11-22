<script lang="ts" setup>
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { confirmAction } from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import ProcessButton from "@/page-components/ProcessButton.vue";
import { VForm } from "vuetify/components";

// VARIABLE
const form_add_customer = ref<VForm>();
const customer_data = ref({
  name: "",
  gender: null,
  service_number: null,
  id_card: {
    type: null,
    number: null,
    image: null,
  },
  location: {
    lat: null,
    lng: null,
  },
});
const options = ref({
  gender: [
    {
      title: "Laki-laki",
      value: "L",
    },
    {
      title: "Perempuan",
      value: "P",
    },
  ],
  id_card: [
    {
      title: "KTP",
      value: "KTP",
    },
    {
      title: "NPWP",
      value: "NPWP",
    },
    {
      title: "SIM",
      value: "SIM",
    },
    {
      title: "PASPOR",
      value: "PASPOR",
    },
    {
      title: "KIS",
      value: "KIS",
    },
    {
      title: "BPJS",
      value: "BPJS",
    },
    {
      title: "Lainnya",
      value: "OTHER",
    },
  ],
  package: [
    {
      title: "Paket 1",
      value: "paket_1",
    },
    {
      title: "Paket 2",
      value: "paket_2",
    },
    {
      title: "Paket 3",
      value: "paket_3",
    },
  ],
  invoice_type: [
    {
      title: "Prabayar",
      value: "prabayar",
    },
    {
      title: "Pascabayar",
      value: "pascabayar",
    },
  ],
  boolean_value: [
    {
      title: "Ya",
      value: true,
    },
    {
      title: "Tidak",
      value: false,
    },
  ],
});

// FUNCTION
const saveCustomer = () => {
  form_add_customer.value?.validate().then((form) => {
    if (form.valid) {
      console.log("valid");
    } else {
      console.log("tidak valid");
    }
  });
};
const resetForm = async () => {
  const is_confirmed = await confirmAction(
    "Reset Formulir?",
    "Formulir pendaftaran pelanggan akan di reset",
    "Ya, Reset!"
  );
  if (is_confirmed) {
    form_add_customer.value?.reset();
  }
};
const changeLocation = (data: any) => {
  customer_data.value.location = data;
};
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
      <VForm ref="form_add_customer" @submit.prevent="saveCustomer">
        <VRow>
          <VCol cols="12" md="6" sm="12">
            <VRow>
              <VCol cols="12">
                <VTextField :rules="[requiredValidator]">
                  <template #label>
                    Nama Pelanggan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="5" sm="12">
                <VSelect :items="options.gender" :rules="[requiredValidator]">
                  <template #label>
                    Jenis Kelamin <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="7" sm="12">
                <VTextField :rules="[requiredValidator, integerValidator]">
                  <template #prepend-inner>
                    <span class="text-primary">26240231</span>
                  </template>
                  <template #label>
                    Nomor Layanan <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="5" sm="12">
                <VSelect :items="options.id_card" :rules="[requiredValidator]">
                  <template #label>
                    Kartu Identitas <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="7" sm="12">
                <VTextField :rules="[requiredValidator, integerValidator]">
                  <template #label>
                    Nomor Kartu Identitas <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="12" sm="12">
                <VFileInput :rules="[requiredValidator]">
                  <template #label>
                    Foto Kartu Identitas <span class="text-error">*</span>
                  </template>
                </VFileInput>
              </VCol>
              <VCol cols="12">
                <VTextField :rules="[requiredValidator]">
                  <template #label>
                    Email <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField :rules="[requiredValidator]">
                  <template #label>
                    No Telp/Whatsapp <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VSelect :items="options.package" :rules="[requiredValidator]">
                  <template #label>
                    Paket Langganan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VSelect
                  :items="options.invoice_type"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Jenis Tagihan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VSelect
                  :items="options.boolean_value"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    PPN 11% <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="4" sm="12">
                <VSelect
                  :items="options.boolean_value"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kode Unik <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="12" sm="12">
                <VSelect :items="options.id_card" :rules="[requiredValidator]">
                  <template #label>
                    Coverage Area <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VSelect :items="options.gender" :rules="[requiredValidator]">
                  <template #label>
                    Mode Pelanggan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VSelect :items="options.gender" :rules="[requiredValidator]">
                  <template #label>
                    Router <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="6" sm="12">
            <VRow>
              <VCol cols="12" md="7" sm="12">
                <VSelect :items="options.gender" :rules="[requiredValidator]">
                  <template #label>
                    ODP <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol cols="12" md="5" sm="12">
                <VTextField :rules="[requiredValidator]">
                  <template #label>
                    Port ODP <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.location.lat"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Latitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="customer_data.location.lng"
                  type="number"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    longitude <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <GoogleMaps
                  height="230px"
                  :lat="customer_data.location.lat"
                  :lng="customer_data.location.lng"
                  @update-value="changeLocation"
                />
              </VCol>
            </VRow>
          </VCol>

          <VCol cols="12">
            <div class="d-flex gap-2 justify-end">
              <VBtn color="warning" @click="resetForm"> Reset </VBtn>
              <ProcessButton
                :is_on_process="false"
                size="default"
                type="submit"
              />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
