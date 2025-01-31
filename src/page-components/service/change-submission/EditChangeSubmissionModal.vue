<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { IObjectKeys } from "@/models";
import { errorMessage, showActionResult, thousandSeparator } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "changeSubmissionUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  type: [
    {
      title: "Ubah Layanan",
      value: "PPPOE",
    },
    {
      title: "Tambah Layanan",
      value: "ADD-ONS",
    },
  ],
  package: [],
});
const change_submission_form = ref<VForm>();
const change_submission_data = ref({
  type: props.data.type,
  id_package: props.data.id_package,
  reason_message: props.data.reason_message,
});

// FUNCTION
const getPackageOptions = () => {
  const params: IObjectKeys = {
    is_displayed: 1,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns.get(`options/package?${query}`).then((res) => {
    options.value.package = res?.data?.package_options || [];
  });
};
const updateChangeSubmission = () => {
  change_submission_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`change-submission/update/${props.data._id}`, {
          data: change_submission_data.value,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Pengajuan Telah Diubah!");
          emits("changeSubmissionUpdated");
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
  change_submission_data.value.type = props.data.type;
  change_submission_data.value.id_package = props.data.id_package;
  change_submission_data.value.reason_message = props.data.reason_message;
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getPackageOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" prepend-icon="tabler-edit" color="info">
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Pengguna </template>
        </VCardItem>
        <VCardText>
          <VForm
            ref="change_submission_form"
            @submit.prevent="updateChangeSubmission"
          >
            <VRow>
              <!-- TYPE -->
              <VCol cols="12">
                <VSelect
                  v-model="change_submission_data.type"
                  :items="options.type"
                  :rules="[requiredValidator]"
                  @update:model-value="change_submission_data.id_package = null"
                >
                  <template #label>
                    Jenis Pengajuan <span class="text-error">*</span>
                  </template>
                </VSelect>
              </VCol>
              <!-- PACKAGE -->
              <VCol v-if="change_submission_data.type" cols="12">
                <VSelect
                  v-model="change_submission_data.id_package"
                  :items="options.package.filter((el:any)=>el.category === change_submission_data.type)"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Nama Layanan <span class="text-error">*</span>
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
              <!-- REASON MESSAGE -->
              <VCol cols="12">
                <VTextarea
                  v-model="change_submission_data.reason_message"
                  placeholder="Masukkan Alasan Perubahan Untuk Pertimbangan Persetujuan"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Alasan Perubahan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      size="default"
                      color="error"
                      block
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
