<script setup lang="ts">
import {
  phoneNumberValidator,
  requiredValidator,
} from "@/@core/utils/validators";
import { errorMessage, roleFormatter, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const is_on_process = ref(false);
const options = ref({
  type: [
    {
      title: "Pesan Broadcast",
      value: "broadcast",
    },
    {
      title: "Pesan Khusus",
      value: "single",
    },
  ],
  contact: [],
});
const message_form = ref<VForm>();
const message_data = ref({
  type: "broadcast",
  broadcast_to: null,
  single_to: null,
  title: null,
  message: "",
});

// FUNCTION
const getContactOptions = () => {
  axiosIns.get("options/whatsapp-contact").then((res) => {
    options.value.contact = res?.data?.contact_options || [];
  });
};
const sendMessage = () => {
  message_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_on_process.value = true;
      const domain = import.meta.env.VITE_API_DOMAIN;
      let url = "";
      let params = {};
      if (message_data.value.type == "single") {
        url = `${domain}/whatsapp-message/single/send`;
        params = {
          destination: message_data.value.single_to,
          title: message_data.value.title,
          message: message_data.value.message,
        };
      } else {
        const selected_options: any = options.value.contact.find(
          (el: any) => el.value === message_data.value.broadcast_to
        );
        url = `${domain}/whatsapp-message/broadcast/send`;
        params = {
          destination: message_data.value.broadcast_to,
          title: message_data.value.title,
          group: selected_options?.group || null,
          message: message_data.value.message,
        };
      }
      axiosIns
        .post(url, {
          data: params,
        })
        .then(() => {
          showActionResult(undefined, undefined, "Pesan Telah Dikirimkan!");
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(undefined, "error", message);
        })
        .finally(() => {
          is_on_process.value = false;
        });
    }
  });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getContactOptions();
});
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-send" />
      </template>
      <template #title> Kirim Pesan Whatsapp </template>
    </VCardItem>
    <VCardText>
      <VForm ref="message_form" @submit.prevent="sendMessage">
        <VRow>
          <!-- TYPE -->
          <VCol cols="12" md="3" sm="12">
            <VSelect
              v-model="message_data.type"
              label="Jenis Pesan"
              :items="options.type"
              :rules="[requiredValidator]"
            />
          </VCol>
          <!-- BROADCAST TO -->
          <VCol cols="12" md="4" sm="12">
            <VAutocomplete
              v-if="message_data.type === 'broadcast'"
              v-model="message_data.broadcast_to"
              label="Tujuan Pesan"
              :items="options.contact"
              :rules="[requiredValidator]"
            >
              <template v-slot:selection="{ props, item }">
                <span class="fs-14">
                  <span v-if="item?.raw?.group == 'user'">
                    Semua
                    <strong>
                      {{
                        item?.raw?.value == "all"
                          ? "Kontak"
                          : roleFormatter(item?.raw?.title).title
                      }}
                    </strong>
                  </span>
                  <span v-else-if="item?.raw?.group == 'package'">
                    Pelanggan Dengan Paket
                    <strong> {{ item?.raw?.title }} </strong>
                  </span>
                  <span v-else-if="item?.raw?.group == 'coverage_area'">
                    Pelanggan Di Wilayah
                    <strong> {{ item?.raw?.title }} </strong>
                  </span>
                  <span v-else-if="item?.raw?.group == 'odp'">
                    Pelanggan Di ODP
                    <strong> {{ item?.raw?.title }} </strong>
                  </span>
                </span>
              </template>
              <template v-slot:item="{ props, item }">
                <VListItem v-bind="props" class="px-2">
                  <template #title>
                    <span class="fs-14">
                      <span v-if="item?.raw?.group == 'user'">
                        Semua
                        <strong>
                          {{
                            item?.raw?.value == "all"
                              ? "Kontak"
                              : roleFormatter(item?.raw?.title).title
                          }}
                        </strong>
                      </span>
                      <span v-else-if="item?.raw?.group == 'package'">
                        Pelanggan Dengan Paket
                        <strong> {{ item?.raw?.title }} </strong>
                      </span>
                      <span v-else-if="item?.raw?.group == 'coverage_area'">
                        Pelanggan Di Wilayah
                        <strong> {{ item?.raw?.title }} </strong>
                      </span>
                      <span v-else-if="item?.raw?.group == 'odp'">
                        Pelanggan Di ODP
                        <strong> {{ item?.raw?.title }} </strong>
                      </span>
                      ({{ item?.raw?.count }} Orang)
                    </span>
                  </template>
                  <template #subtitle>
                    <VChip
                      v-if="item?.raw?.group == 'user'"
                      size="x-small"
                      variant="flat"
                      color="primary"
                    >
                      Berdasarkan Pengguna
                    </VChip>
                    <VChip
                      v-if="item?.raw?.group == 'package'"
                      size="x-small"
                      variant="flat"
                      color="warning"
                    >
                      Berdasarkan Paket
                    </VChip>
                    <VChip
                      v-if="item?.raw?.group == 'coverage_area'"
                      size="x-small"
                      variant="flat"
                      color="success"
                    >
                      Berdasarkan Wilayah
                    </VChip>
                    <VChip
                      v-if="item?.raw?.group == 'odp'"
                      size="x-small"
                      variant="flat"
                      color="info"
                    >
                      Berdasarkan ODP
                    </VChip>
                  </template>
                </VListItem>
              </template>
            </VAutocomplete>
            <VTextField
              v-else
              v-model="message_data.single_to"
              label="Tujuan Pesan"
              :rules="[requiredValidator, phoneNumberValidator]"
            >
              <template #prepend-inner> +62 </template>
            </VTextField>
          </VCol>
          <!-- TITLE -->
          <VCol cols="12" md="5" sm="12">
            <VTextField
              v-model="message_data.title"
              label="Judul Pesan"
              :rules="[requiredValidator]"
            />
          </VCol>
          <!-- BODY -->
          <VCol cols="12">
            <div>
              <VTextarea
                v-model="message_data.message"
                auto-grow
                :rules="[requiredValidator]"
              >
                <template #label> Isi Pesan </template>
              </VTextarea>
            </div>
          </VCol>
          <!-- ACTION BUTTON -->
          <VCol cols="12">
            <div class="d-flex gap-2 justify-end">
              <ProcessButton
                :is_on_process="is_on_process"
                size="default"
                type="submit"
                text="Kirim Sekarang"
              />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
