<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import { package_category_options } from "@/modules/options";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";

// INTERFACE
interface IEmits {
  (e: "packageAdded"): void;
}

// VARIABLE
const store = stateManagement();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  category: package_category_options,
  router_profile: [],
  boolean: [
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
const package_form = ref<VForm>();
const package_data = ref({
  name: null,
  category: null,
  router_profile: null,
  bandwidth: 0,
  instalation_cost: 0,
  maximum_device: 0,
  price: {
    regular: 0,
    reseller: 0,
  },
  is_displayed: false,
  description: "",
});

// FUNCTION
const getRouterProfileOptions = () => {
  axiosIns
    .get(`options/router-profile?name=${store.getCurrentRouter}`)
    .then((res) => {
      options.value.router_profile = res.data.router_profile_options || [];
    });
};
const savePackage = () => {
  package_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .post("package/add", {
          data: package_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Paket Telah Ditambahkan!");
          emits("packageAdded");
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
    }
  });
};
const resetForm = () => {
  package_form.value?.reset();
  package_data.value.bandwidth = 0;
  package_data.value.instalation_cost = 0;
  package_data.value.maximum_device = 0;
  package_data.value.price.regular = 0;
  package_data.value.price.reseller = 0;
  package_data.value.is_displayed = false;
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getRouterProfileOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Paket </VTooltip>
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
          <template #title> Tambah Paket </template>
        </VCardItem>
        <VCardText>
          <VForm ref="package_form" @submit.prevent="savePackage">
            <VRow>
              <!-- NAME -->
              <VCol cols="12" md="8" sm="12">
                <VTextField
                  v-model="package_data.name"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Paket <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- CATEGORY -->
              <VCol cols="12" md="4" sm="12">
                <VSelect
                  v-model="package_data.category"
                  :items="options.category"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Kategori <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- PROFILE -->
              <VCol
                v-if="package_data.category === 'PPPOE'"
                cols="12"
                md="7"
                sm="12"
              >
                <VAutocomplete
                  v-model="package_data.router_profile"
                  :items="options.router_profile"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Profil Router <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- BANDWIDTH -->
              <VCol
                v-if="package_data.category === 'PPPOE'"
                cols="12"
                md="5"
                sm="12"
              >
                <VTextField
                  v-model="package_data.bandwidth"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Bandwidth <span class="text-error">*</span>
                  </template>
                  <template #append-inner> Mbps </template>
                </VTextField>
              </VCol>
              <!-- REGULAR PRICE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="package_data.price.regular"
                  type="number"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Harga Reguler <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- RESELLER PRICE -->
              <VCol cols="12" md="6" sm="12">
                <VTextField
                  v-model="package_data.price.reseller"
                  type="number"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Harga Reseller <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- INSTALATION COST -->
              <VCol cols="12" md="5" sm="12">
                <VTextField
                  v-model="package_data.instalation_cost"
                  type="number"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #prepend-inner> Rp </template>
                  <template #label>
                    Biaya Instalasi <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- MAX DEVICE -->
              <VCol cols="12" md="4" sm="12">
                <VTextField
                  v-model="package_data.maximum_device"
                  type="number"
                  :rules="[requiredValidator, integerValidator]"
                >
                  <template #label>
                    Maksimum Perangkat <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <!-- DISPLAY STATUS -->
              <VCol cols="12" md="3" sm="12">
                <VSelect
                  v-model="package_data.is_displayed"
                  :items="options.boolean"
                >
                  <template #label>
                    Ditampilkan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- DESCRIPTION -->
              <VCol cols="12">
                <VTextarea
                  v-model="package_data.description"
                  label="Deskripsi"
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
                      @click="(is_showing_modal = false), resetForm()"
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
