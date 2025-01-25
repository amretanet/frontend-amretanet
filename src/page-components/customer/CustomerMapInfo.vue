<script setup lang="ts">
import {
  customerStatusFormatter,
  dateFormatterID,
  googleMapsUrlFormatter,
  thousandSeparator,
  whatsappUrlFormatter,
} from "@/modules";
import HorizontalTextFormat from "../HorizontalTextFormat.vue";

// INTERFACE
interface IProps {
  data: any;
}

// VARIABLE
const props = defineProps<IProps>();
</script>
<template>
  <div style="width: 450px">
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Nomor Layanan"
      :value="props?.data?.service_number || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Nama Pelanggan"
      :value="props?.data?.name || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Paket Langganan"
    >
      <template #value>
        <div class="d-flex gap-2 align-center">
          <VChip
            v-for="item in props?.data?.package || []"
            size="x-small"
            color="primary"
          >
            {{ item.name }}
          </VChip>
        </div>
      </template>
    </HorizontalTextFormat>
    <HorizontalTextFormat
      v-if="
        'add_on_packages' in props.data && props.data.add_on_packages.length > 0
      "
      :title_cols="5"
      :value_cols="7"
      title="Paket Tambahan"
    >
      <template #value>
        <div class="d-flex gap-2 align-center flex-wrap">
          <VChip
            v-for="item in props?.data?.add_on_packages || []"
            size="x-small"
            color="primary"
          >
            {{ item.name }}
          </VChip>
        </div>
      </template>
    </HorizontalTextFormat>
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Jumlah Tagihan"
      :value="'Rp' + thousandSeparator(props?.data?.billing || 0)"
    />
    <HorizontalTextFormat
      v-if="'due_date' in props.data"
      :title_cols="5"
      :value_cols="7"
      title="Jatuh Tempo"
      :value="'Tanggal ' + props?.data?.due_date || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Email"
      :value="props?.data?.email || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Nomor Telepon"
      :value="'0' + props?.data?.phone_number || ''"
    >
      <template #value>
        <div>
          <a
            :href="whatsappUrlFormatter(props?.data?.phone_number || '')"
            target="_blank"
            class="font-weight-bold"
          >
            0{{ props?.data?.phone_number || "" }}
          </a>
        </div>
      </template>
    </HorizontalTextFormat>
    <HorizontalTextFormat :title_cols="5" :value_cols="7" title="Status">
      <template #value>
        <VChip
          :color="customerStatusFormatter(props?.data?.status || '').color"
          size="x-small"
        >
          {{ customerStatusFormatter(props?.data?.status || "").title }}
        </VChip>
      </template>
    </HorizontalTextFormat>
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Kode Referral"
      :value="props?.data?.referral || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Terdaftar Sejak"
      :value="
        props?.data?.registered_at
          ? dateFormatterID(props.data.registered_at)
          : '-'
      "
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Alamat"
      :value="props?.data?.location?.address || '-'"
    />
    <div class="mt-5">
      <a
        :href="
          googleMapsUrlFormatter(
            props?.data?.location?.latitude || 0,
            props?.data?.location?.longitude || 0
          )
        "
        target="_blank"
        class="text-primary clickable"
      >
        Lihat di Google Maps
      </a>
    </div>
  </div>
</template>
