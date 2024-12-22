<script setup lang="ts">
import { dateFormatterID, ticketStatusFormatter } from "@/modules";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";

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
    <VDialog :model-value="is_showing_modal" max-width="600" persistent>
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
            <VChip>
              {{ dateFormatterID(props.data.created_at, true, true) }}
            </VChip>
          </template>
        </VCardItem>
        <VCardText>
          <HorizontalTextFormat
            title="Dibuat Oleh"
            :value="props?.data?.creator || '-'"
          />
          <HorizontalTextFormat
            title="Teknisi"
            :value="props?.data?.assignee || '-'"
          />
          <HorizontalTextFormat
            v-if="props?.data?.type === 'TKT'"
            title="Pelanggan"
            :value="props?.data?.reporter || '-'"
          />
          <div v-if="'customer' in props.data">
            <HorizontalTextFormat
              title="Nomor Layanan"
              :value="props?.data?.customer?.service_number || '-'"
            />
            <HorizontalTextFormat
              title="Email"
              :value="props?.data?.customer?.email || '-'"
            />
            <HorizontalTextFormat
              title="Nomor Telepon"
              :value="
                props?.data?.customer?.phone_number
                  ? `0${props.data.customer.phone_number}`
                  : '-'
              "
            />
            <HorizontalTextFormat
              title="Alamat"
              :value="props?.data?.customer?.location?.address || '-'"
            />
          </div>
          <HorizontalTextFormat
            title="Judul"
            :value="props?.data?.title || '-'"
          />
          <HorizontalTextFormat
            title="Deskripsi"
            :value="props?.data?.description || '-'"
          />
          <HorizontalTextFormat title="ODC" :value="props?.data?.odc || '-'" />
          <HorizontalTextFormat title="ODP" :value="props?.data?.odp || '-'" />
          <HorizontalTextFormat
            title="Status"
            :value="
              props?.data?.status
                ? ticketStatusFormatter(props.data.status).title
                : '-'
            "
          >
            <template #value>
              <VChip
                :color="ticketStatusFormatter(props.data.status).color"
                variant="flat"
              >
                {{ ticketStatusFormatter(props.data.status).title }}
              </VChip>
            </template>
          </HorizontalTextFormat>
          <!-- {{ props.data }} -->
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
