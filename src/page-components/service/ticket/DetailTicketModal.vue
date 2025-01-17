<script setup lang="ts">
import { dateFormatterID, ticketStatusFormatter } from "@/modules";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";
import { Marker } from "vue3-google-map";

// INTERFACE
interface IProps {
  data: any;
}

// VARIABLE
const props = defineProps<IProps>();
const is_showing_modal = ref(false);
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="35" color="success" prepend-icon="tabler-eye">
          <VTooltip activator="parent"> Detail Tiket </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="650" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-ticket" />
          </template>
          <template #title>
            Detail Tiket (#{{ props?.data?.name || "" }})
          </template>
          <template #append>
            <VChip
              :color="ticketStatusFormatter(props.data.status).color"
              variant="flat"
            >
              {{ ticketStatusFormatter(props.data.status).title }}
            </VChip>
          </template>
        </VCardItem>
        <VCardText class="scroller" style="max-height: 80vh">
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="Dibuat Oleh"
            :value="props?.data?.creator || '-'"
          />
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="Teknisi"
            :value="props?.data?.assignee || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.type === 'TKT'"
            :title_cols="5"
            :value_cols="7"
            title="Pelanggan"
            :value="props?.data?.reporter || '-'"
          />
          <div v-if="'customer' in props.data">
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Nomor Layanan"
              :value="props?.data?.customer?.service_number || '-'"
            />
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Username PPPOE"
              :value="props?.data?.customer?.pppoe_username || '-'"
            />
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Password PPPOE"
              :value="props?.data?.customer?.pppoe_password || '-'"
            />
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Email"
              :value="props?.data?.customer?.email || '-'"
            />
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Nomor Telepon"
              :value="
                props?.data?.customer?.phone_number
                  ? `0${props.data.customer.phone_number}`
                  : '-'
              "
            />
            <HorizontalTextFormat
              :title_cols="5"
              :value_cols="7"
              title="Alamat"
              :value="props?.data?.customer?.location?.address || '-'"
            />
          </div>
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="Judul"
            :value="props?.data?.title || '-'"
          />
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="Deskripsi"
            :value="props?.data?.description || '-'"
          />
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="Dibuat Pada"
            :value="dateFormatterID(props.data.created_at, true, true)"
          />
          <HorizontalTextFormat
            v-if="props?.data?.closed_at"
            :title_cols="5"
            :value_cols="7"
            title="Selesai Pada"
            :value="dateFormatterID(props.data.closed_at, true, true)"
          />
          <HorizontalTextFormat
            v-if="props?.data?.confirm_message"
            :title_cols="5"
            :value_cols="7"
            title="Pesan Konfirmasi"
            :value="props?.data?.confirm_message || '-'"
          />
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="ODC"
            :value="props?.data?.odc || '-'"
          />
          <HorizontalTextFormat
            :title_cols="5"
            :value_cols="7"
            title="ODP"
            :value="props?.data?.odp || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.cable"
            :title_cols="5"
            :value_cols="7"
            title="Panjang Kabel"
            :value="props?.data?.cable + ' Meter' || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.hardware"
            :title_cols="5"
            :value_cols="7"
            title="Perangkat"
            :value="props?.data?.hardware || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.serial_number"
            :title_cols="5"
            :value_cols="7"
            title="Serial Number"
            :value="props?.data?.serial_number || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.tube"
            :title_cols="5"
            :value_cols="7"
            title="Warna/Core"
            :value="props?.data?.tube || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.re_odp"
            :title_cols="5"
            :value_cols="7"
            title="Redaman Awal (IN/ODP)"
            :value="props?.data?.re_odp || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.re_ont"
            :title_cols="5"
            :value_cols="7"
            title="Redaman Akhir (OUT/ONT)"
            :value="props?.data?.re_ont || '-'"
          />
          <HorizontalTextFormat
            v-if="
              props?.data?.location?.latitude &&
              props?.data?.location?.longitude
            "
            :title_cols="5"
            title="Lokasi"
            :value_cols="12"
          >
            <template #value>
              <GoogleMaps
                height="250px"
                :lat="props.data.location.latitude"
                :lng="props.data.location.longitude"
              >
                <template #marker>
                  <Marker
                    :options="{
                      position: {
                        lat: props.data.location.latitude,
                        lng: props.data.location.longitude,
                      },
                    }"
                  />
                </template>
              </GoogleMaps>
            </template>
          </HorizontalTextFormat>
          <VRow>
            <VCol v-if="props?.data?.evidence?.odp_image_url" cols="12" md="6">
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto ODP</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.odp_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
            <VCol v-if="props?.data?.evidence?.ont_image_url" cols="12" md="6">
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto ONT</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.ont_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
            <VCol
              v-if="props?.data?.evidence?.ont_position_image_url"
              cols="12"
              md="6"
            >
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto Posisi ONT</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.ont_position_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
            <VCol
              v-if="props?.data?.evidence?.customer_image_url"
              cols="12"
              md="6"
            >
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto Pelanggan</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.customer_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
            <VCol
              v-if="props?.data?.evidence?.house_image_url"
              cols="12"
              md="6"
            >
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto Rumah Pelanggan</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.house_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
            <VCol
              v-if="props?.data?.evidence?.other_image_url"
              cols="12"
              md="6"
            >
              <div class="text-center border rounded-lg px-2 py-2">
                <div>Foto Lainnya</div>
                <img
                  class="mt-2 rounded-lg"
                  :src="props?.data?.evidence?.other_image_url"
                  style="width: 100%"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
