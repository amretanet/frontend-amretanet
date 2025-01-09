<script setup lang="ts">
import { thousandSeparator } from "@/modules";
import axiosIns from "@/plugins/axios";
import HorizontalTextFormat from "../HorizontalTextFormat.vue";
import PieChart from "../PieChart.vue";
import BarChart from "../BarChart.vue";

// VARIABLE
const is_loading = ref(true);
const is_cash_balance_loading = ref(true);
const income_stats = ref({
  count: 0,
  today: 0,
  current_week: 0,
  current_month: 0,
  last_month: 0,
  current_year: 0,
  unpaid: 0,
  month_difference: 0,
  month_difference_percentage: 0,
  month_trend: "no_change",
});
const pie_chart_data = ref({
  series: [0, 0, 0, 0, 0],
  label: ["Hari Ini", "Minggu Ini", "Bulan Ini", "Tahun Ini", "Belum Bayar"],
  color: ["#0083db", "#28C76F", "#709fba", "#A8AAAE", "#FF9F43"],
});
const cash_balance = ref(0);
const bar_chart_data = ref({
  categories: [] as any[],
  series: [
    {
      name: "Pemasukan",
      data: [],
      color: "#28C76F",
    },
    {
      name: "Pengeluaran",
      data: [],
      color: "#EA5455",
    },
  ],
});
const is_cash_balance = ref(false);

// FUNCTION
const getIncomeStats = () => {
  is_loading.value = true;
  axiosIns
    .get("income/stats")
    .then((res) => {
      income_stats.value.count = res?.data?.income_stats?.count || 0;
      income_stats.value.today = res?.data?.income_stats?.today || 0;
      income_stats.value.current_week =
        res?.data?.income_stats?.current_week || 0;
      income_stats.value.current_month =
        res?.data?.income_stats?.current_month || 0;
      income_stats.value.last_month = res?.data?.income_stats?.last_month || 0;
      income_stats.value.current_year =
        res?.data?.income_stats?.current_year || 0;
      income_stats.value.unpaid = res?.data?.income_stats?.unpaid || 0;
      income_stats.value.month_difference =
        res?.data?.income_stats?.month_difference || 0;
      income_stats.value.month_difference_percentage =
        res?.data?.income_stats?.month_difference_percentage || 0;
      income_stats.value.month_trend =
        res?.data?.income_stats?.month_trend || 0;
      pie_chart_data.value.series[0] = income_stats.value.today;
      pie_chart_data.value.series[1] = income_stats.value.current_week;
      pie_chart_data.value.series[2] = income_stats.value.unpaid;
      pie_chart_data.value.series[3] = income_stats.value.current_year;
      pie_chart_data.value.series[4] = income_stats.value.current_month;
    })
    .finally(() => {
      is_loading.value = false;
    });
};
const getCashBalance = () => {
  is_cash_balance_loading.value = true;
  axiosIns
    .get("income/cash-balance")
    .then((res) => {
      cash_balance.value = res?.data?.cash_balance || 0;
      bar_chart_data.value.categories = res?.data?.categories || [];
      bar_chart_data.value.series[0].data = res?.data?.incomes || [];
      bar_chart_data.value.series[1].data = res?.data?.expenditures || [];
    })
    .finally(() => {
      is_cash_balance_loading.value = false;
    });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getIncomeStats();
  getCashBalance();
});
</script>

<template>
  <VRow>
    <VCol cols="12" md="5">
      <VCard color="#000" class="h-100">
        <VCardItem>
          <template #append>
            <div class="text-white" style="letter-spacing: 0.2em">
              MASTERCARD
            </div>
          </template>
        </VCardItem>
        <VCardText class="pb-0" style="min-height: 12rem">
          <div class="d-flex justify-space-between gap-2">
            <div>
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="50px"
                height="50px"
                viewBox="0 0 50 50"
                xml:space="preserve"
              >
                <image
                  id="image0"
                  width="50"
                  height="50"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
              fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
              ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
              e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
              ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
              u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
              fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
              lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
              tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
              g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
              /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
              orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
              GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
              OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
              I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
              lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
              JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0F
              qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM
              1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm
              BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET
              amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC
              S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj
              cmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
              MjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
              LTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="
                ></image>
              </svg>
            </div>
            <div>
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="50px"
                height="50px"
                viewBox="0 0 50 50"
                xml:space="preserve"
              >
                <image
                  id="image0"
                  width="50"
                  height="50"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
              cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQf
              lGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/F
              fPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xN
              GQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49it
              VoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJk
              HpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15z
              bkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6g
              DJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJ
              qSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKB
              sSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71Amz
              Z+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uX
              XSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUi
              cUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaI
              nKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBK
              xDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDIt
              MTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5
              OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1Nisw
              MDowMIXeN6gAAAAASUVORK5CYII="
                ></image>
              </svg>
            </div>
          </div>
          <div class="mt-5 d-flex flex-column gap-5">
            <div class="text-white fs-35 font-weight-black">
              Rp{{ thousandSeparator(income_stats.current_month) }}
            </div>
            <div class="text-white fs-18">
              Pemasukan Bulan Ini
              <small
                v-if="income_stats.month_trend === 'increase'"
                class="text-success fs-12 ms-2"
              >
                (+{{ income_stats.month_difference_percentage.toFixed(1) }}%
                Dari bulan lalu)
              </small>
              <small
                v-else-if="income_stats.month_trend === 'decrease'"
                class="text-error fs-12 ms-2"
              >
                ({{ income_stats.month_difference_percentage.toFixed(1) }}% Dari
                bulan lalu)
              </small>
            </div>
          </div>
          <div
            class="d-flex justify-end"
            style="position: absolute; bottom: 0; right: 20px"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100px"
                height="100px"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#ff9800"
                  d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                ></path>
                <path
                  fill="#d50000"
                  d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                ></path>
                <path
                  fill="#ff3d00"
                  d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                ></path>
              </svg>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="7">
      <VCard>
        <VCardItem class="py-3">
          <template #title>
            {{ is_cash_balance ? "Saldo Kas" : "Perhitungan Pemasukan" }}
          </template>
          <template #append>
            <VSwitch v-model="is_cash_balance" label="Saldo Kas" />
          </template>
        </VCardItem>
        <VRow v-if="!is_cash_balance">
          <VCol cols="12" md="6">
            <VCardText class="pt-0">
              <PieChart
                :series="pie_chart_data.series"
                :labels="pie_chart_data.label"
                :colors="pie_chart_data.color"
                :is_loading="is_loading"
                :height="250"
              />
            </VCardText>
          </VCol>
          <VCol cols="12" md="6">
            <VCardText class="pt-0">
              <div class="d-flex flex-column gap-2 justify-space-between">
                <div class="border rounded-lg px-2 py-2 bg-primary">
                  <HorizontalTextFormat
                    title="Hari Ini"
                    :value="'Rp' + thousandSeparator(income_stats.today)"
                    :title_cols="5"
                    :value_cols="7"
                  />
                </div>
                <div class="border rounded-lg px-2 py-2 bg-success">
                  <HorizontalTextFormat
                    title="Minggu Ini"
                    :value="'Rp' + thousandSeparator(income_stats.current_week)"
                    :title_cols="5"
                    :value_cols="7"
                  />
                </div>
                <div class="border rounded-lg px-2 py-2 bg-info">
                  <HorizontalTextFormat
                    title="Bulan Ini"
                    :value="
                      'Rp' + thousandSeparator(income_stats.current_month)
                    "
                    :title_cols="5"
                    :value_cols="7"
                  />
                </div>
                <div class="border rounded-lg px-2 py-2 bg-secondary">
                  <HorizontalTextFormat
                    title="Tahun Ini"
                    :value="'Rp' + thousandSeparator(income_stats.current_year)"
                    :title_cols="5"
                    :value_cols="7"
                  />
                </div>
                <div class="border rounded-lg px-2 py-2 bg-warning">
                  <HorizontalTextFormat
                    title="Belum Bayar"
                    :value="'Rp' + thousandSeparator(income_stats.unpaid)"
                    :title_cols="5"
                    :value_cols="7"
                  />
                </div>
              </div>
            </VCardText>
          </VCol>
        </VRow>
        <VRow v-else>
          <VCol cols="12">
            <VCardText class="pt-0">
              <div class="fs-30 font-weight-black">
                Rp{{ thousandSeparator(cash_balance) }}
              </div>
              <div class="mt-4">
                <BarChart
                  :categories="bar_chart_data.categories"
                  :series="bar_chart_data.series"
                  :is_loading="is_cash_balance_loading"
                />
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>
</template>
