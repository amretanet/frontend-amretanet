<script setup lang="ts">
import {
  customerStatusFormatter,
  dateFormatterID,
  googleMapsUrlFormatter,
  thousandSeparator,
  whatsappUrlFormatter,
} from "@/modules";
import HorizontalTextFormat from "@/page-components/HorizontalTextFormat.vue";

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
      title="Nama/Kode ODP"
      :value="props?.data?.name || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Kapasitas"
      :value="thousandSeparator(props?.data?.capacity || 0) + ' Core/Port'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Tersedia"
      :value="thousandSeparator(props?.data?.available || 0) + ' Core/Port'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Redaman"
      :value="props?.data?.damping + 'dB' || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Alamat"
      :value="props?.data?.location?.address || '-'"
    />
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Keterangan"
      :value="props?.data?.description || '-'"
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
