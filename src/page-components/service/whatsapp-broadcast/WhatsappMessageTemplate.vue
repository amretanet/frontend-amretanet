<script setup lang="ts">
import { errorMessage, showActionResult } from "@/modules";
import ProcessButton from "@/page-components/ProcessButton.vue";
import axiosIns from "@/plugins/axios";
import { VForm } from "vuetify/components";

// VARIABLES
const is_advance_on_process = ref(false);
const is_on_process = ref(false);
const variable_description = [
  {
    key: "judul",
    description: "Cek Di Pengaturan Lainnya",
  },
  {
    key: "nama_pelanggan",
    description: "Nama Pelanggan",
  },
  {
    key: "no_ktp",
    description: "Nomor Identitas Pelanggan",
  },
  {
    key: "alamat",
    description: "Alamat Pelanggan",
  },
  {
    key: "tanggal_psb",
    description: "Tanggal Pemasangan",
  },
  {
    key: "no_service",
    description: "Nomor Layanan Pelanggan",
  },
  {
    key: "nama_paket",
    description: "Nama Paket Langganan",
  },
  {
    key: "harga",
    description: "Harga Paket Langganan",
  },
  {
    key: "jumlah_tagihan",
    description: "Total Tagihan Pelanggan",
  },
  {
    key: "metode_bayar",
    description: "Metode Pembayaran (default)",
  },
  {
    key: "status",
    description: "Status Pembayaran",
  },
  {
    key: "tgl_due_date",
    description: "Tanggal Jatuh Tempo",
  },
  {
    key: "bulan_tagihan",
    description: "Bulan Tagihan Pelanggan",
  },
  {
    key: "tahun_tagihan",
    description: "Tahun Tagihan Pelanggan",
  },
  {
    key: "hari",
    description: "Hari Ini",
  },
  {
    key: "bulan",
    description: "Bulan Sekarang",
  },
  {
    key: "tahun",
    description: "Tahun Sekarang",
  },
  {
    key: "link",
    description: "URL Pembayaran",
  },
  {
    key: "body_wa",
    description: "Cek Di Pengaturan Lainnya",
  },
  {
    key: "footer_wa",
    description: "Cek Di Pengaturan Lainnya",
  },
  {
    key: "thanks_wa",
    description: "Cek Di Pengaturan Lainnya",
  },
];
const exist_template = ref({
  activate: "",
  billing: "",
  isolir: "",
  overdue: "",
  paid: "",
  register: "",
  reminder: "",
});
const options = ref({
  template: [
    {
      title: "Terbit",
      value: "billing",
    },
    {
      title: "Reminder",
      value: "reminder",
    },
    {
      title: "Dibayar",
      value: "paid",
    },
    {
      title: "Isolir",
      value: "isolir",
    },
    {
      title: "Aktivasi",
      value: "activate",
    },
    {
      title: "Overdue",
      value: "overdue",
    },
    {
      title: "Daftar",
      value: "register",
    },
  ],
});
const template_form = ref<VForm>();
const template_data = ref({
  type: null,
  message: "",
});
const advance_template_form = ref<VForm>();
const advance_template_data = ref({
  header: "",
  body: "",
  footer: "",
  thanks_message: "",
  thanks_image: "",
  isolir_image: "",
  unique_code_status: false,
  unique_code_message: "",
  saldo_fee: "",
});

// FUNCTION
const getMessageTemplate = () => {
  axiosIns.get("whatsapp-message/template").then((res) => {
    exist_template.value.activate = res?.data?.template_data?.activate || "";
    exist_template.value.billing = res?.data?.template_data?.billing || "";
    exist_template.value.isolir = res?.data?.template_data?.isolir || "";
    exist_template.value.overdue = res?.data?.template_data?.overdue || "";
    exist_template.value.paid = res?.data?.template_data?.paid || "";
    exist_template.value.register = res?.data?.template_data?.register || "";
    exist_template.value.reminder = res?.data?.template_data?.reminder || "";

    advance_template_data.value.body =
      res?.data?.template_data?.advance?.body || "";
    advance_template_data.value.header =
      res?.data?.template_data?.advance?.header || "";
    advance_template_data.value.footer =
      res?.data?.template_data?.advance?.footer || "";
    advance_template_data.value.thanks_message =
      res?.data?.template_data?.advance?.thanks_message || "";
    advance_template_data.value.thanks_image =
      res?.data?.template_data?.advance?.thanks_image || "";
    advance_template_data.value.isolir_image =
      res?.data?.template_data?.advance?.isolir_image || "";
    advance_template_data.value.unique_code_status =
      res?.data?.template_data?.advance?.unique_code_status == 1 ? true : false;
    advance_template_data.value.unique_code_message =
      res?.data?.template_data?.advance?.unique_code_message || "";
    advance_template_data.value.saldo_fee =
      res?.data?.template_data?.advance?.saldo_fee || 0;
  });
};
const updateMessageTemplate = () => {
  if (!template_data.value.type || !template_data.value.message) {
    showActionResult(
      undefined,
      "error",
      "Mohon Isi Template Pesan Dengan Benar!"
    );
    return;
  }
  is_on_process.value = true;
  axiosIns
    .put(`whatsapp-message/template/update/${template_data.value.type}`, {
      message: template_data.value.message,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Template Telah Diubah!");
      getMessageTemplate();
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(undefined, "error", message);
    })
    .finally(() => {
      is_on_process.value = false;
    });
};
const updateAdvanceTemplate = () => {
  is_advance_on_process.value = true;
  let params: any = advance_template_data.value;
  if (advance_template_data.value.unique_code_status) {
    params.unique_code_status = 1;
  } else {
    params.unique_code_status = 0;
  }
  axiosIns
    .put("whatsapp-message/template/advance-update", {
      data: advance_template_data.value,
    })
    .then(() => {
      showActionResult(undefined, undefined, "Pengaturan Telah Diubah!");
    })
    .catch((err) => {
      const message = errorMessage(err);
      showActionResult(undefined, "error", message);
    })
    .finally(() => {
      is_advance_on_process.value = false;
    });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getMessageTemplate();
});
watch(
  () => template_data.value.type,
  () => {
    if (template_data.value.type) {
      template_data.value.message =
        exist_template.value[template_data.value.type];
    } else {
      template_data.value.message = "";
    }
  }
);
</script>
<template>
  <VRow>
    <VCol cols="12" md="5" sm="12">
      <VCard class="h-100">
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-info-circle" />
          </template>
          <template #title> Deskripsi Kode Variabel </template>
        </VCardItem>
        <VCardText>
          <div class="d-flex flex-column gap-2 fs-15">
            <div v-for="item in variable_description" class="d-flex gap-2">
              <div class="text-primary font-weight-black">
                <strong>[{{ item.key }}] </strong>
              </div>
              <div>
                <VIcon icon="tabler-arrow-right"></VIcon>
              </div>
              <div>{{ item.description }}</div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="7" sm="12">
      <VCard class="h-100">
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-message" />
          </template>
          <template #title> Template Pesan Whatsapp </template>
        </VCardItem>
        <VCardText>
          <VForm ref="template_form" @submit.prevent="updateMessageTemplate">
            <VRow>
              <!-- TYPE -->
              <VCol cols="12">
                <VSelect
                  v-model="template_data.type"
                  label="Tipe Pesan"
                  :items="options.template"
                  clearable
                />
              </VCol>
              <!-- BODY -->
              <VCol cols="12">
                <VTextarea
                  v-model="template_data.message"
                  label="Isi Pesan"
                  rows="20"
                  auto-grow
                />
              </VCol>
              <!-- ACTION BUTTON -->
              <VCol cols="12">
                <div class="d-flex gap-2 justify-end">
                  <VBtn color="warning" size="default" type="reset">
                    Reset
                  </VBtn>
                  <ProcessButton
                    :is_on_process="is_on_process"
                    size="default"
                    type="submit"
                  />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-message-star" />
          </template>
          <template #title> Pengaturan Lainnya </template>
        </VCardItem>
        <VCardText>
          <VForm
            ref="advance_template_form"
            @submit.prevent="updateAdvanceTemplate"
          >
            <VRow>
              <VCol cols="12" md="6" sm="12">
                <VRow>
                  <!-- HEADER -->
                  <VCol cols="12">
                    <VTextarea
                      v-model="advance_template_data.header"
                      label="Header Pesan Whatsapp"
                      rows="2"
                      auto-grow
                    />
                  </VCol>
                  <!-- BODY -->
                  <VCol cols="12">
                    <VTextarea
                      v-model="advance_template_data.body"
                      label="Body Pesan Whatsapp"
                      rows="5"
                      auto-grow
                    />
                  </VCol>
                  <!-- FOOTER -->
                  <VCol cols="12">
                    <VTextarea
                      v-model="advance_template_data.footer"
                      label="Footer Pesan Whatsapp"
                      rows="2"
                      auto-grow
                    />
                  </VCol>
                  <!-- INVOICE PAID -->
                  <VCol cols="12">
                    <VTextarea
                      v-model="advance_template_data.thanks_message"
                      label="Tagihan Sudah Dibayar"
                      rows="2"
                      auto-grow
                    />
                  </VCol>
                </VRow>
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VRow>
                  <!-- UNIQUE CODE -->
                  <VCol cols="12">
                    <VSwitch
                      v-model="advance_template_data.unique_code_status"
                      label="Aktifkan Kode Unik Tagihan"
                    />
                  </VCol>
                  <!-- UNIQUE CODE DESCRIPTION -->
                  <VCol
                    v-if="advance_template_data.unique_code_status"
                    cols="12"
                  >
                    <VTextField
                      v-model="advance_template_data.unique_code_message"
                      label="Deskripsi Kode Unik"
                    />
                  </VCol>
                  <!-- SALDO -->
                  <VCol cols="12">
                    <VTextField
                      v-model="advance_template_data.saldo_fee"
                      label="Nominal Bonus Saldo"
                    />
                  </VCol>
                  <!-- REMINDER IMAGE URL -->
                  <VCol cols="12">
                    <VTextField
                      v-model="advance_template_data.isolir_image"
                      label="URL Gambar Reminder"
                    />
                  </VCol>
                  <!-- THANKS IMAGE URL -->
                  <VCol cols="12">
                    <VTextField
                      v-model="advance_template_data.thanks_image"
                      label="URL Gambar Terimakasih"
                    />
                  </VCol>
                  <!-- IMAGE PREVIEW -->
                  <VCol cols="12">
                    <div class="d-flex gap-2 justify-space-between">
                      <img
                        :src="advance_template_data.isolir_image"
                        style="
                          max-width: 45%;
                          max-height: 10rem;
                          object-fit: contain;
                        "
                        alt="reminder"
                      />
                      <img
                        :src="advance_template_data.thanks_image"
                        style="
                          max-width: 45%;
                          max-height: 10rem;
                          object-fit: contain;
                        "
                        alt="thanks"
                      />
                    </div>
                  </VCol>
                  <!-- ACTION BUTTON -->
                  <VCol cols="12">
                    <div class="d-flex gap-2 justify-end">
                      <VBtn color="warning" size="default" type="reset">
                        Reset
                      </VBtn>
                      <ProcessButton
                        :is_on_process="is_advance_on_process"
                        size="default"
                        type="submit"
                      />
                    </div>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
