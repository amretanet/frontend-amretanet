<script setup lang="ts">
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { arrayCounter } from "@/modules";
import SkeletonLoader from "@/page-components/SkeletonLoader.vue";
import EmptyAlert from "@/page-components/EmptyAlert.vue";

// INTERFACE
interface IProps {
  height?: number;
  series: any;
  labels: any;
  colors?: any;
  is_loading: boolean;
}

// VARIABLE
const props = defineProps<IProps>();
const chart = ref({
  height: props.height || 200,
  series: props.series,
  configuration: {
    chart: {
      toolbar: { show: true },
    },
    legend: {
      position: "bottom",
      fontFamily: "Public Sans",
      labels: {
        colors: "#A8AAAE",
      },
    },
    labels: props.labels,
    ...(props.colors ? { colors: props.colors } : {}),
  },
});
const is_empty = computed(() => {
  for (let i in chart.value.series) {
    const value = arrayCounter(chart.value.series);
    if (value > 0) {
      return false;
    }
  }
  return true;
});
const is_loading = ref(props.is_loading);

// LIFECYCLE HOOKS
watch(props, () => {
  is_loading.value = props.is_loading;
  chart.value.series = props.series;
});
</script>
<template>
  <div>
    <div
      v-if="is_loading"
      style="display: flex; align-items: center; justify-content: center"
    >
      <div>
        <SkeletonLoader
          :width="`${chart.height / 1.5}px`"
          :height="`${chart.height / 1.5}px`"
          rounded="50%"
        />
        <SkeletonLoader
          :width="`${chart.height / 1.5}px`"
          height="20px"
          class="mt-5"
        />
      </div>
    </div>
    <div v-else>
      <EmptyAlert v-if="is_empty" />
      <VueApexCharts
        v-else
        :height="chart.height"
        type="pie"
        :options="chart.configuration"
        :series="chart.series"
      />
    </div>
  </div>
</template>
