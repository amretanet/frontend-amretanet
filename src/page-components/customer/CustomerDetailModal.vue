<script setup lang="ts">
import {
  customerStatusFormatter,
  genderFormatter,
  thousandSeparator,
  whatsappUrlFormatter,
} from "@/modules";
import axiosIns from "@/plugins/axios";
import { Marker } from "vue3-google-map";
import HorizontalTextFormat from "../HorizontalTextFormat.vue";
import GoogleMaps from "../GoogleMaps.vue";

// INTERFACE
interface IProps {
  data: any;
}

// VARIABLE
const props = defineProps<IProps>();
const is_showing_modal = ref(false);
const customer_data = ref<any>({});

// FUNCTION
const getCustomerDetail = () => {
  axiosIns.get(`/customer/detail/${props.data._id}`).then((res) => {
    customer_data.value = res?.data?.customer_data || {};
  });
};

// LIFECYCLE HOOKS
watch(is_showing_modal, () => {
  if (is_showing_modal.value) {
    getCustomerDetail();
  }
});
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="success" prepend-icon="tabler-eye">
          <VTooltip activator="parent"> Lihat Detail </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="1000" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-user" />
          </template>
          <template #title> Detail Pelanggan </template>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Nama"
                :value="customer_data?.name || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Nomor Layanan"
                :value="customer_data?.service_number || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Status"
              >
                <template #value>
                  <VChip
                    :color="
                      customerStatusFormatter(customer_data?.status || '').color
                    "
                  >
                    {{
                      customerStatusFormatter(customer_data?.status || "").title
                    }}
                  </VChip>
                </template>
              </HorizontalTextFormat>
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Kartu Identitas"
                :value="
                  customer_data?.id_card?.type +
                    '-' +
                    customer_data?.id_card?.number || '-'
                "
              />
              <img
                :src="customer_data?.id_card?.image_url"
                class="rounded mt-2"
                style="max-height: 180px; width: 300px; object-fit: contain"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Jenis Kelamin"
                :value="genderFormatter(customer_data?.gender || '') || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Email"
                :value="customer_data?.email || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Nomor Telepon"
              >
                <template #value>
                  <a
                    :href="
                      whatsappUrlFormatter(customer_data?.phone_number || '')
                    "
                    target="_blank"
                    class="font-weight-bold clickable"
                  >
                    0{{ customer_data?.phone_number || "" }}
                  </a>
                </template>
              </HorizontalTextFormat>
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Status Rumah"
                :value="customer_data?.location?.house_status || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Pemilik Rumah"
                :value="customer_data?.location?.house_owner || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Alamat"
                :value="customer_data?.location?.address || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Deskripsi"
                :value="customer_data?.description || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Paket Internet"
              >
                <template #value>
                  <div
                    v-if="customer_data?.package"
                    class="d-flex flex-wrap-gap-2"
                  >
                    <div v-if="customer_data.package.length === 0">-</div>
                    <VChip
                      v-else
                      v-for="item in customer_data.package"
                      color="primary"
                    >
                      {{ item?.name || "Tidak Diketahui" }}
                    </VChip>
                  </div>
                </template>
              </HorizontalTextFormat>
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Paket Tambahan"
              >
                <template #value>
                  <div
                    v-if="customer_data?.add_on_packages"
                    class="d-flex flex-wrap gap-2"
                  >
                    <div v-if="customer_data.add_on_packages.length === 0">
                      -
                    </div>
                    <VChip
                      v-else
                      v-for="item in customer_data.add_on_packages"
                      color="primary"
                    >
                      {{ item?.name || "Tidak Diketahui" }}
                    </VChip>
                  </div>
                </template>
              </HorizontalTextFormat>
            </VCol>
            <VCol cols="12" md="6">
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Total Tagihan"
                :value="`Rp${thousandSeparator(customer_data?.billing || 0)}`"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Jenis Tagihan"
                :value="customer_data?.billing_type || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Status PPN"
                :value="customer_data?.ppn ? 'Ya' : 'Tidak'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Jatuh Tempo"
                :value="
                  customer_data?.due_date
                    ? `Tanggal ${customer_data.due_date}`
                    : '-'
                "
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Coverage Area"
                :value="customer_data?.coverage_area_name || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="ODP"
                :value="customer_data?.odp_name || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Port ODP"
                :value="customer_data?.port_odp || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Router"
                :value="customer_data?.router_name || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Username PPPOE"
                :value="customer_data?.pppoe_username || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Password PPPOE"
                :value="customer_data?.pppoe_password || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="7"
                title="Kode Referral"
                :value="customer_data?.referral || '-'"
              />
              <HorizontalTextFormat
                :title_cols="5"
                :value_cols="12"
                title="Lokasi"
              >
                <template #value>
                  <div class="px-2">
                    <GoogleMaps :zoom="16" height="250px">
                      <template #marker>
                        <Marker
                          :options="{
                            position: {
                              lat: customer_data?.location?.latitude || 0,
                              lng: customer_data?.location?.longitude || 0,
                            },
                          }"
                        />
                      </template>
                    </GoogleMaps>
                  </div>
                </template>
              </HorizontalTextFormat>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
