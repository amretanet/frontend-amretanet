<script setup lang="ts">
import { arrayCounter, kmbtFormatter, minMaxSeriesFormatter } from "@/modules";
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import SkeletonLoader from "@/page-components/SkeletonLoader.vue";
import EmptyAlert from "@/page-components/EmptyAlert.vue";

// INTERFACE
interface IProps {
  not_stacked?: boolean;
  height?: number;
  legend_height?: number;
  title?: string;
  series: any;
  categories: any;
  is_dual_yaxis?: boolean;
  dual_yaxis_series?: string;
  is_loading: boolean;
  custom_cursor?: boolean;
}
interface IEmits {
  (e: "chartClicked", data: any): void;
}

// VARIABLE
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();
const column_chart = ref();
const legend_height = ref(props.legend_height);
const dual_yaxis = ref({
  status: props.is_dual_yaxis,
  title: props.dual_yaxis_series,
  min: minMaxSeriesFormatter(props.series, props.dual_yaxis_series || "Reach")
    .min,
  max: minMaxSeriesFormatter(props.series, props.dual_yaxis_series || "Reach")
    .max,
});
const chart = ref({
  height: props.height || 200,
  series: props.series,
  configuration: {
    chart: {
      type: "bar",
      stacked: !props.not_stacked,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: props.not_stacked ? "50%" : "20px",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Public Sans",
      labels: {
        colors: "#A8AAAE",
      },
      ...(legend_height.value ? { height: legend_height.value } : {}),
    },
    xaxis: {
      categories: props.categories,
      labels: {
        rotate: -25,
        rotateAlways: false,
        hideOverlappingLabels: true,
        maxHeight: 100,
        trim: false,
        style: {
          colors: "#A8AAAE",
          fontSize: "10px",
          fontFamily: "Public Sans",
          fontWeight: 500,
        },
      },
    },
    yaxis: dual_yaxis.value.status
      ? [
          {
            labels: {
              hideOverlappingLabels: true,
              maxHeight: 120,
              style: {
                colors: "#A8AAAE",
                fontSize: "10px",
                fontFamily: "Public Sans",
                fontWeight: 500,
              },
              formatter: function (value: number) {
                const number = value || 0;
                return kmbtFormatter(number);
              },
            },
            title: {
              text: props.title || "Jumlah Data",
              style: {
                color: "#A8AAAE",
                fontSize: "12px",
                fontFamily: "Public Sans",
                fontWeight: 500,
              },
            },
          },
          {
            min: dual_yaxis.value.min,
            max: dual_yaxis.value.max,
            opposite: true,
            labels: {
              hideOverlappingLabels: true,
              maxHeight: 120,
              style: {
                colors: "#A8AAAE",
                fontSize: "10px",
                fontFamily: "Public Sans",
                fontWeight: 500,
              },
              formatter: function (value: number) {
                const number = value || 0;
                return kmbtFormatter(number);
              },
            },
            title: {
              text: dual_yaxis.value.title,
              style: {
                color: "#A8AAAE",
                fontSize: "12px",
                fontFamily: "Public Sans",
                fontWeight: 500,
              },
            },
          },
        ]
      : {
          labels: {
            hideOverlappingLabels: true,
            maxHeight: 120,
            style: {
              colors: "#A8AAAE",
              fontSize: "10px",
              fontFamily: "Public Sans",
              fontWeight: 500,
            },
            formatter: function (value: number) {
              const number = value || 0;
              return kmbtFormatter(number);
            },
          },
          title: {
            text: props.title || "Jumlah Data",
            style: {
              color: "#A8AAAE",
              fontSize: "12px",
              fontFamily: "Public Sans",
              fontWeight: 500,
            },
          },
        },
    tooltip: {
      enabled: true,
      shared: false,
      followCursor: true,
      style: {
        fontSize: "12px",
        fontFamily: "Public Sans",
      },
    },
  },
});
const is_empty = computed(() => {
  for (let i in chart.value.series) {
    const value = arrayCounter(chart.value.series[i].data);
    if (value > 0) {
      return false;
    }
  }
  return true;
});
const is_loading = ref(props.is_loading);
const custom_cursor = ref(props.custom_cursor || false);

// FUNCTION
function chartClickHandler(event: any, chartContext: any, config: any) {
  const data = {
    data_index: config.dataPointIndex,
    series_index: config.seriesIndex,
  };
  emit("chartClicked", data);
}

function mountedChartHandler() {
  if (column_chart.value) {
    if (custom_cursor.value == true) {
      const stylebar =
        column_chart.value?.$el.querySelector(".apexcharts-canvas");
      if (stylebar) {
        stylebar.style.cursor = "pointer";
      }
    } else {
      const stylebar =
        column_chart.value?.$el.querySelector(".apexcharts-canvas");
      if (stylebar) {
        stylebar.style.cursor = "default";
      }
    }
  }
}

// LIFECYCLE HOOKS
watch(props, () => {
  is_loading.value = props.is_loading;
  legend_height.value = props.legend_height;
  chart.value.series = props.series;
  chart.value.configuration.xaxis.categories = props.categories;
  dual_yaxis.value = {
    status: props.is_dual_yaxis,
    title: props.dual_yaxis_series,
    min: minMaxSeriesFormatter(props.series, props.dual_yaxis_series || "Reach")
      .min,
    max: minMaxSeriesFormatter(props.series, props.dual_yaxis_series || "Reach")
      .max,
  };
  if (props.is_dual_yaxis) {
    if (Array.isArray(chart.value.configuration.yaxis)) {
      chart.value.configuration.yaxis[1].min = dual_yaxis.value.min;
      chart.value.configuration.yaxis[1].max = dual_yaxis.value.max;
    }
  }
});
</script>
<template>
  <div>
    <SkeletonLoader
      v-if="is_loading"
      width="100%"
      :height="`${chart.height}px`"
    />
    <div v-else>
      <EmptyAlert v-if="is_empty" />
      <VueApexCharts
        v-else
        ref="column_chart"
        :height="chart.height"
        :options="chart.configuration"
        :series="chart.series"
        @dataPointSelection="chartClickHandler"
        @mounted="mountedChartHandler"
      />
    </div>
  </div>
</template>
