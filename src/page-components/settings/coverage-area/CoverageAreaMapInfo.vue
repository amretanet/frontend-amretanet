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

// FUNCTION
const addressFormatter = (data: any) => {
  const address = `${data.address.location_name}, RT ${data.address.rt} /RW ${data.address.rw}, Desa. ${data.address.village}, Kec. ${data.address.subdistrict}, Kab. ${data.address.regency}, Prov. ${data.address.province} - Indonesia ${data.address.postal_code}`;
  return address;
};
</script>
<template>
  <div style="width: 450px">
    <HorizontalTextFormat
      :title_cols="5"
      :value_cols="7"
      title="Nama/Kode Area"
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
    <HorizontalTextFormat :title_cols="5" :value_cols="7" title="Alamat">
      <template #value>
        {{ addressFormatter(props.data) }}
      </template>
    </HorizontalTextFormat>
    <div class="mt-5">
      <a
        :href="
          googleMapsUrlFormatter(
            props?.data?.address?.latitude || 0,
            props?.data?.address?.longitude || 0
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
