<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, showActionResult, thousandSeparator } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "invoiceUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const invoice_form = ref<VForm>();
const invoice_data = ref(JSON.parse(JSON.stringify(props.data)));
const options = ref({
  package: [],
});

// FUNCTION
const getPackageOptions = () => {
  axiosIns.get("options/package").then((res) => {
    options.value.package = res?.data?.package_options || [];
  });
};
const updateInvoice = () => {
  invoice_form.value?.validate().then((form) => {
    if (form.valid) {
      is_on_process.value = true;
      const params = {
        id_invoice: invoice_data.value._id,
        id_customer: invoice_data.value.id_customer,
        id_package: invoice_data.value?.customer?.id_package,
        id_add_on_package:
          invoice_data.value?.customer?.id_add_on_package || [],
      };
      axiosIns
        .put("invoice/update", {
          data: params,
        })
        .then(() => {
          emits("invoiceUpdated");
          showActionResult(undefined, undefined, "Invoice Telah Diubah!");
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
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    invoice_data.value = JSON.parse(JSON.stringify(props.data));
    getPackageOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="info">
          <VIcon icon="tabler-edit" />
          <VTooltip activator="parent"> Edit </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-edit" />
          </template>
          <template #title> Edit Layanan Pelanggan </template>
        </VCardItem>
        <!-- EDIT FORM -->
        <VCardText>
          <VForm ref="invoice_form" @submit.prevent="updateInvoice()">
            <VRow>
              <!-- NAME -->
              <VCol cols="12">
                <VTextField
                  v-model="invoice_data.name"
                  label="Nama Pelanggan"
                  readonly
                />
              </VCol>
              <!-- SERVICE NUMBER -->
              <VCol cols="12">
                <VTextField
                  v-model="invoice_data.service_number"
                  label="Nomor Layanan"
                  readonly
                />
              </VCol>
              <!-- PACKAGE -->
              <VCol cols="12">
                <VSelect
                  v-model="invoice_data.customer.id_package"
                  :items="options.package.filter((el:any)=>el.type !=='ADD-ONS')"
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
              <!-- ADD ONS PACKAGE -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="invoice_data.customer.id_add_on_package"
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
                </VAutocomplete>
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
                  >
                    Batal
                  </VBtn>
                  <ProcessButton type="submit" :is_on_process="is_on_process" />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
