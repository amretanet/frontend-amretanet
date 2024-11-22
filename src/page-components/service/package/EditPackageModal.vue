<script setup lang="ts">
import { integerValidator, requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "packageUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  mikrotik_profile: [],
});
const package_form = ref<VForm>();
const package_data = ref({
  name: props?.data?.name || "",
  mikrotik_profile: props?.data?.mikrotik_profile || null,
  bandwidth: props?.data?.bandwidth || 0,
  instalation_cost: props?.data?.instalation_cost || 0,
  price: {
    regular: props?.data?.price?.regular || 0,
    reseller: props?.data?.price?.reseller || 0,
  },
  is_displayed: props?.data?.is_displayed || false,
  description: props?.data?.description || "",
});

// FUNCTION
const getMikrotikProfileOptions = () => {
  axiosIns.get("options/mikrotik-profile").then((res) => {
    options.value.mikrotik_profile = res.data.mikrotik_profile_options || [];
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
          emits("packageUpdated");
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
  package_data.value.price.regular = 0;
  package_data.value.price.reseller = 0;
  package_data.value.is_displayed = false;
};

// LIFECYCLE HOOKS
watch(props, () => {
  package_data.value.name = props?.data?.name || "";
  package_data.value.mikrotik_profile = props?.data?.mikrotik_profile || null;
  package_data.value.bandwidth = props?.data?.bandwidth || 0;
  package_data.value.instalation_cost = props?.data?.instalation_cost || 0;
  package_data.value.price = {
    regular: props?.data?.price?.regular || 0,
    reseller: props?.data?.price?.reseller || 0,
  };
  package_data.value.is_displayed = props?.data?.is_displayed || false;
  package_data.value.description = props?.data?.description || "";
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getMikrotikProfileOptions();
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
    <VDialog :model-value="is_showing_modal" max-width="550" persistent>
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
              <VCol cols="12">
                <VTextField
                  v-model="package_data.name"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Paket <span class="text-error">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="7" sm="12">
                <VAutocomplete
                  v-model="package_data.mikrotik_profile"
                  :items="options.mikrotik_profile"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Profil Mikrotik <span class="text-error">*</span>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol cols="12" md="5" sm="12">
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
              <VCol cols="12" md="7" sm="12">
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
              <VCol cols="12" md="5" sm="12">
                <VSwitch v-model="package_data.is_displayed">
                  <template #label> Tampilkan Paket </template>
                </VSwitch>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="package_data.description"
                  type="number"
                  label="Deskripsi"
                />
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="(is_showing_modal = false)"
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
