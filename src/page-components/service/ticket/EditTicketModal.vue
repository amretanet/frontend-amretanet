<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import { errorMessage, roleFormatter, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// INTERFACE
interface IProps {
  data: any;
}
interface IEmits {
  (e: "ticketUpdated"): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const is_on_process = ref(false);
const is_showing_modal = ref(false);
const options = ref({
  user: [],
  odp: [],
  odc: [],
  title: [],
});
const ticket_form = ref<VForm>();
const ticket_data = ref({
  id_reporter: props?.data?.id_reporter || null,
  id_assignee: props?.data?.id_assignee || null,
  id_odc: props?.data?.id_odc || null,
  id_odp: props?.data?.id_odp || null,
  title: props?.data?.title || null,
  description: props?.data?.description || null,
});

// FUNCTION
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
const updateTicket = () => {
  ticket_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      axiosIns
        .put(`ticket/update/${props.data._id}`, {
          data: ticket_data.value,
        })
        .then(() => {
          emits("ticketUpdated");
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
  ticket_data.value.id_reporter = props?.data?.id_reporter || null;
  ticket_data.value.id_assignee = props?.data?.id_assignee || null;
  ticket_data.value.id_odc = props?.data?.id_odc || null;
  ticket_data.value.id_odp = props?.data?.id_odp || null;
  ticket_data.value.title = props?.data?.title || null;
  ticket_data.value.description = props?.data?.description || null;
});
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getTicketTitleOptions();
    getUserOptions();
    getODCOptions();
    getODPOptions();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" prepend-icon="tabler-edit">
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
          <template #title> Edit Tiket </template>
        </VCardItem>
        <VCardText>
          <VForm ref="ticket_form" @submit.prevent="updateTicket">
            <VRow>
              <VCol cols="12">
                <VAutocomplete
                  v-model="ticket_data.id_reporter"
                  :items="options.user"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Pelapor <span class="text-error">*</span>
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
                            :color="roleFormatter(item?.raw?.role).color"
                          >
                            {{ roleFormatter(item?.raw?.role).type }}
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol cols="12">
                <VAutocomplete
                  v-model="ticket_data.id_assignee"
                  :items="options.user.filter((el:any)=>el.role !==99)"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Penerima Tugas <span class="text-error">*</span>
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
                            :color="roleFormatter(item?.raw?.role).color"
                          >
                            {{ roleFormatter(item?.raw?.role).type }}
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
              </VCol>
              <VCol cols="12">
                <VAutocomplete
                  v-model="ticket_data.id_odc"
                  label="ODC"
                  :items="options.odc"
                  clearable
                />
              </VCol>
              <VCol cols="12">
                <VAutocomplete
                  v-model="ticket_data.id_odp"
                  label="ODP"
                  :items="options.odp"
                  clearable
                />
              </VCol>
              <VCol cols="12">
                <VCombobox
                  v-model="ticket_data.title"
                  :items="options.title"
                  :rules="[requiredValidator]"
                  clearable
                >
                  <template #label>
                    Judul Pesan <span class="text-error">*</span>
                  </template>
                </VCombobox>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="ticket_data.description"
                  label="Isi Pesan"
                  :rules="[requiredValidator]"
                >
                  <template #label>
                    Deskripsi Pesan <span class="text-error">*</span>
                  </template>
                </VTextarea>
              </VCol>
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn
                    size="small"
                    color="error"
                    @click="is_showing_modal = false"
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
