<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import { package_category_options } from "@/modules/options";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "packageUpdated"): void;
}

// VARIABLE
const store = stateManagement();
const props = defineProps<IProps>();
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
  name: props?.data?.name || null,
  category: props?.data?.category || null,
  router_profile: props?.data?.router_profile || null,
  bandwidth: props?.data?.bandwidth || 0,
  instalation_cost: props?.data?.instalation_cost || 0,
  maximum_device: props?.data?.maximum_device || 0,
  price: {
    regular: props?.data?.price?.regular || 0,
    reseller: props?.data?.price?.reseller || 0,
  },
  is_displayed: props?.data?.is_displayed || false,
  description: props?.data?.description || null,
});

// FUNCTION
const getRouterProfileOptions = () => {
  axiosIns
    .get(`options/router-profile?name=${store.getCurrentRouter}`)
    .then((res) => {
      options.value.router_profile = res.data.router_profile_options || [];
    });
};
const updatePackage = () => {
  package_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`package/update/${props.data._id}`, {
          data: package_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Paket Telah Diubah!");
          emits("packageUpdated");
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
  package_data.value.name = props?.data?.name || "";
  package_data.value.router_profile = props?.data?.router_profile || null;
  package_data.value.bandwidth = props?.data?.bandwidth || 0;
  package_data.value.instalation_cost = props?.data?.instalation_cost || 0;
  package_data.value.maximum_device = props?.data?.maximum_device || 0;
  package_data.value.price = {
    regular: props?.data?.price?.regular || 0,
    reseller: props?.data?.price?.reseller || 0,
  };
  package_data.value.is_displayed = props?.data?.is_displayed || false;
  package_data.value.description = props?.data?.description || "";
});
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
          <template #title> Edit Paket </template>
        </VCardItem>
        <VCardText>
          <VForm ref="package_form" @submit.prevent="updatePackage">
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
