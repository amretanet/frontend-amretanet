<script setup lang="ts">
import instalation_image from "@/assets/images/illustrations/instalation.png";
import payment_image from "@/assets/images/illustrations/payment.png";
import registration_image from "@/assets/images/illustrations/registration-form.png";
import { IObjectKeys } from "@/models";
import { thousandSeparator } from "@/modules";
import CheckCustomerDataModal from "@/page-components/CheckCustomerDataModal.vue";
import EmptyAlert from "@/page-components/EmptyAlert.vue";
import GoogleMaps from "@/page-components/GoogleMaps.vue";
import PrivacyModal from "@/page-components/PrivacyModal.vue";
import SkeletonLoader from "@/page-components/SkeletonLoader.vue";
import TermConditionModal from "@/page-components/TermConditionModal.vue";
import axiosIns from "@/plugins/axios";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { Marker, InfoWindow } from "vue3-google-map";
import CoverageAreaMapInfo from "@/page-components/settings/coverage-area/CoverageAreaMapInfo.vue";

// VARIABLE
const { theme } = useThemeConfig();
const router = useRouter();
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const today = new Date();
const is_drawer_open = ref(false);
const is_package_loading = ref(true);
const current_nav = ref("#home");
const marker_info_index = ref(null);
const navigations = ref([
  {
    icon: "mdi-home",
    to: "#home",
    name: "BERANDA",
  },
  {
    icon: "mdi-package-variant",
    to: "#package",
    name: "PAKET",
  },
  {
    icon: "mdi-map-marker",
    to: "#area",
    name: "CAKUPAN AREA",
  },
]);
const subscribe_step = ref([
  {
    icon: "mdi-note-multiple-outline",
    color: "primary",
    title: "Registrasi",
    image: registration_image,
    description:
      "Cek ketersediaan lokasi pemasangan, pilih paket terbaik sesuai kebutuhan Anda, dan tentukan jadwal pemasangan yang nyaman untuk Anda!",
  },
  {
    icon: "mdi-tools",
    color: "warning",
    title: "Instalasi",
    image: instalation_image,
    description:
      "Pantau progres instalasi WiFi Anda dengan mudah, dan segera nikmati layanan terbaik dari AMRETA NET!",
  },
  {
    icon: "mdi-wallet",
    color: "success",
    title: "Pembayaran",
    image: payment_image,
    description:
      "Selesaikan pembayaran dengan mudah dan rasakan kecepatan maksimal layanan AMRETA NET!",
  },
]);
const our_features = ref([
  {
    icon: "fas fa-wifi",
    title: "100% Fiber Optik",
    description:
      "Fiber optik adalah teknologi canggih yang menggunakan serat kaca atau plastik tipis untuk mentransmisikan data berupa cahaya. Karena menggunakan cahaya, fiber optik mampu mengirimkan informasi dengan kecepatan luar biasa hingga gigabit per detik, jauh lebih cepat daripada kabel tembaga tradisional.",
    why: [
      {
        title: "Kecepatan Tinggi",
        subtitle:
          "Data berjalan dengan kecepatan cahaya, cocok untuk internet ultra-cepat, video streaming tanpa buffering, dan game online.",
      },
      {
        title: "Kapasitas Besar",
        subtitle:
          "Mampu mengirimkan data dalam jumlah besar secara bersamaan tanpa gangguan.",
      },
      {
        title: "Keamanan Tinggi",
        subtitle:
          "Sinyal tidak dapat disadap tanpa memutus kabelnya, sehingga lebih aman dibandingkan kabel lainnya.",
      },
      {
        title: "Tahan Gangguan",
        subtitle:
          "Tidak terpengaruh oleh medan elektromagnetik, menjadikannya ideal untuk lingkungan industri atau jarak jauh.",
      },
    ],
  },
  {
    icon: "fas fa-cloud-download-alt",
    title: "Download & Upload (1:1)",
    description:
      "Dalam jaringan internet, download adalah proses mengambil data dari internet ke perangkat Anda, sedangkan upload adalah mengirim data dari perangkat Anda ke internet. Biasanya, kecepatan download jauh lebih tinggi dibandingkan upload, tetapi dengan rasio 1:1, keduanya memiliki kecepatan yang sama.",
    why: [
      {
        title: "Efisiensi Kolaborasi Online",
        subtitle:
          "Unggah dan unduh file besar tanpa hambatan, ideal untuk tim kreatif dan profesional.",
      },
      {
        title: "Streaming Lancar",
        subtitle:
          "Streaming langsung atau konferensi video dengan kualitas tinggi tanpa lag.",
      },
      {
        title: "Gaming Optimal",
        subtitle:
          "Pengalaman bermain game online yang responsif karena data keluar-masuk berjalan seimbang.",
      },
      {
        title: "Unggah Cepat",
        subtitle:
          "Konten kreator dapat mengunggah video atau foto besar dengan kecepatan tinggi.",
      },
    ],
  },
  {
    icon: "fas fa-globe",
    title: "Internet Unlimited",
    description:
      "Internet unlimited adalah layanan internet tanpa batasan kuota, memungkinkan pengguna untuk mengakses apa saja tanpa khawatir kehabisan data. Dengan koneksi ini, Anda bisa menjelajah web, streaming video, bermain game online, hingga mengunduh file besar, kapan saja, dan sebanyak mungkin.",
    why: [
      {
        title: "Bebas Kuota",
        subtitle: "Tidak perlu menghitung penggunaan data setiap saat.",
      },
      {
        title: "Nyaman untuk Streaming",
        subtitle:
          "Nikmati video Full HD atau musik tanpa takut buffering atau tambahan biaya.",
      },
      {
        title: "Ideal untuk Keluarga",
        subtitle:
          "Satu paket untuk semua anggota rumah dengan aktivitas berbeda.",
      },
      {
        title: "Mendukung Remote Work & Belajar",
        subtitle: "Stabil dan andal untuk panggilan video atau akses cloud.",
      },
    ],
  },
]);
const package_data = ref<any[]>([]);
const coverage_area_maps_data = ref<any[]>([]);

// function
const getCoverageAreaData = () => {
  axiosIns.get(`coverage-area?is_maps_only=${true}`).then((res) => {
    coverage_area_maps_data.value = res?.data?.coverage_area_maps_data || [];
  });
};
const getPackageData = () => {
  is_package_loading.value = true;
  const params: IObjectKeys = {
    is_displayed: 1,
    page: 1,
    items: 100,
  };
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  axiosIns
    .get(`package?${query}`)
    .then((res) => {
      package_data.value = res?.data?.package_data || [];
    })
    .finally(() => {
      is_package_loading.value = false;
    });
};
const isElementInViewport = (el: any) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
const addAnimationClass = (
  title_id: string,
  body_id: string,
  animation_class: string
) => {
  const userOverview = document.getElementById(title_id);
  if (userOverview && isElementInViewport(userOverview)) {
    const element = document.getElementById(body_id);
    if (element) {
      if (title_id == "package-title") {
        current_nav.value = "#package";
      } else if (title_id == "area-title") {
        current_nav.value = "#area";
      }
      element.classList.add(animation_class);
    }
  }
};
const removeAnimationClass = (element_id: string, animation_class: string) => {
  const element = document.getElementById(element_id);
  if (element) {
    element.classList.remove(animation_class);
  }
};
const onMarkerHover = (item: any, index: any) => {
  marker_info_index.value = index;
};

window.onscroll = function () {
  const userOverview = document.getElementById("home");
  if (userOverview && isElementInViewport(userOverview)) {
    current_nav.value = "#home";
    removeAnimationClass("features-item-0", "slide-in-left");
    removeAnimationClass("features-item-1", "slide-in-bottom");
    removeAnimationClass("features-item-2", "slide-in-right");
    removeAnimationClass("subscribe-item-0", "slide-in-left");
    removeAnimationClass("subscribe-item-1", "slide-in-bottom");
    removeAnimationClass("subscribe-item-2", "slide-in-right");
    removeAnimationClass("area-item", "fade-in");
    for (let i in package_data.value) {
      removeAnimationClass(`package-item${i}`, "scale-up");
    }
  }
  addAnimationClass("features-title", "features-item-0", "slide-in-left");
  addAnimationClass("features-title", "features-item-1", "slide-in-bottom");
  addAnimationClass("features-title", "features-item-2", "slide-in-right");
  addAnimationClass("subscribe-title", "subscribe-item-0", "slide-in-left");
  addAnimationClass("subscribe-title", "subscribe-item-1", "slide-in-bottom");
  addAnimationClass("subscribe-title", "subscribe-item-2", "slide-in-right");
  addAnimationClass("area-title", "area-item", "fade-in");
  for (let i in package_data.value) {
    addAnimationClass("package-title", `package-item${i}`, "scale-up");
  }
};

onMounted(() => {
  theme.value = "light";
  getPackageData();
  getCoverageAreaData();
});
</script>
<template>
  <div>
    <!-- TOP BAR -->
    <div class="bg-light-info">
      <VContainer>
        <div class="d-flex gap-2 justify-space-between">
          <div class="d-flex gap-3 align-center flex-wrap">
            <div>
              <a
                href="https://www.google.com/maps?q=-6.942853679893406,107.76403158903122"
                target="_blank"
                class="text-muted d-flex gap-1 align-center clickable"
              >
                <VIcon icon="tabler-map-pin" size="20" color="primary" />
                <small>Lihat Lokasi</small>
              </a>
            </div>
            <VDivider
              :vertical="true"
              color="primary"
              thickness="1.5"
              length="22"
              class="mt-1"
            />
            <div>
              <a
                href="mailto:sandi@amreta.net"
                target="_blank"
                class="text-muted d-flex gap-1 align-center clickable"
              >
                <VIcon icon="mdi-email" size="20" color="primary" />
                <small>Kirim Email</small>
              </a>
            </div>
          </div>
          <VCard variant="tonal" rounded="small">
            <VCardText class="px-2 py-1 d-flex gap-2 align-center">
              <a
                href="https://api.whatsapp.com/send?phone=628999094340"
                target="_blank"
              >
                <VIcon icon="mdi-whatsapp" color="primary" class="clickable" />
                <VTooltip activator="parent"> Whatsapp </VTooltip>
              </a>
              <a href="https://facebook.com" target="_blank">
                <VIcon icon="mdi-facebook" color="primary" class="clickable" />
                <VTooltip activator="parent"> Facebook </VTooltip>
              </a>
              <a href="https://instagram.com" target="_blank">
                <VIcon icon="mdi-instagram" color="primary" class="clickable" />
                <VTooltip activator="parent"> Instagram </VTooltip>
              </a>
            </VCardText>
          </VCard>
        </div>
      </VContainer>
    </div>
    <!-- NAV BAR -->
    <div
      class="py-1"
      style="position: sticky; top: 0; background-color: white; z-index: 999"
    >
      <VContainer>
        <div class="d-flex align-center justify-space-between gap-10">
          <a
            href="#"
            class="d-flex align-center gap-2 text-decoration-none"
            style="color: inherit"
          >
            <img src="/short-logo.png" alt="Logo" style="height: 50px" />
            <span class="fs-22 font-weight-black mb-2 text-no-wrap">
              AMRETA NET
            </span>
          </a>
          <div v-if="isLessThanOverlayNavBreakpoint(windowWidth)">
            <VBtn
              prepend-icon="tabler-menu-2"
              size="35"
              variant="tonal"
              @click="is_drawer_open = !is_drawer_open"
            />
          </div>
          <div
            v-else
            class="d-flex align-center px-5 py-3 bg-light-info rounded-lg w-100"
          >
            <div class="d-flex">
              <a
                v-for="item in navigations"
                :href="item.to"
                class="font-weight-bold text-no-wrap clickable fs-13 text-decoration-none"
                :class="current_nav == item.to ? 'text-primary' : ''"
                style="color: inherit"
                @click="current_nav = item.to"
              >
                <VBtn
                  :prepend-icon="item.icon"
                  size="small"
                  :color="current_nav == item.to ? 'primary' : 'dark'"
                  :variant="current_nav == item.to ? 'tonal' : 'text'"
                >
                  <div class="font-weight-bold">
                    {{ item.name }}
                  </div>
                </VBtn>
              </a>
            </div>
            <VSpacer />
            <div>
              <VBtn
                size="small"
                prepend-icon="tabler-login"
                :to="{ name: 'login' }"
              >
                Masuk
              </VBtn>
            </div>
          </div>
        </div>
      </VContainer>
    </div>
    <!-- MOBILE NAV -->
    <VNavigationDrawer v-model="is_drawer_open" location="start" temporary>
      <VCardText class="d-flex flex-column gap-2">
        <a
          href="#"
          class="d-flex align-center gap-2 text-decoration-none"
          style="color: inherit"
        >
          <img src="/short-logo.png" alt="Logo" style="height: 50px" />
          <span class="fs-22 font-weight-black mb-2 text-no-wrap">
            AMRETA NET
          </span>
        </a>
        <VDivider thickness="2" />
        <div class="mt-2 d-flex flex-column gap-2">
          <a v-for="item in navigations" :href="item.to">
            <VBtn
              block
              variant="tonal"
              size="small"
              :color="current_nav === item.to ? 'primary' : 'dark'"
              :prepend-icon="item.icon"
            >
              {{ item.name }}
            </VBtn>
          </a>
        </div>
        <VBtn
          block
          size="small"
          class="mt-5"
          :to="{ name: 'login' }"
          prepend-icon="tabler-login"
        >
          Masuk
        </VBtn>
      </VCardText>
    </VNavigationDrawer>
    <!-- HERO 1 -->
    <div id="home" class="hero-1">
      <VContainer>
        <VRow>
          <VCol cols="12" md="8" sm="12">
            <div
              class="d-flex flex-wrap flex-md-nowrap flex-wrap-reverse gap-10 align-center"
            >
              <div>
                <div
                  class="fs-60 fsm-35 text-primary font-weight-black slide-in-top"
                >
                  Amreta Network
                </div>
                <div
                  class="font-weight-black text-warning fs-32 fsm-20 mt-1 fade-in"
                >
                  Solusi Internet Unlimited, Untuk Aktivitas Tanpa Batas
                </div>
                <div
                  class="fs-20 fsm-12 mt-5 font-weight-bold text-white fade-in"
                >
                  Amreta Network adalah penyedia layanan internet fiber optik
                  yang memberikan solusi untuk kebutuhan internet rumahan serta
                  layanan pengelolaan jaringan untuk rumah pribadi, korporasi
                  atau pemerintahan
                </div>
                <div class="mt-5 d-flex gap-2 flex-wrap">
                  <VBtn
                    variant="flat"
                    color="success"
                    rounded="pill"
                    prepend-icon="tabler-location-check"
                    class="slide-in-left text-white"
                    :size="
                      isLessThanOverlayNavBreakpoint(windowWidth)
                        ? 'small'
                        : 'default'
                    "
                    :to="{ name: 'register' }"
                  >
                    Berlangganan Sekarang
                  </VBtn>
                  <CheckCustomerDataModal>
                    <template #trigger-button>
                      <VBtn
                        variant="outlined"
                        color="warning"
                        rounded="pill"
                        class="slide-in-left"
                        prepend-icon="tabler-checkup-list"
                        :size="
                          isLessThanOverlayNavBreakpoint(windowWidth)
                            ? 'small'
                            : 'default'
                        "
                      >
                        Cek Data Saya
                      </VBtn>
                    </template>
                  </CheckCustomerDataModal>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <!-- HERO 2 -->
    <div id="features" class="container-fluid feature bg-light py-5">
      <VContainer>
        <div
          id="features-title"
          class="text-center mx-auto pb-5"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <div class="text-primary font-weight-bold fs-25 fsm-18">
            Keunggulan Kami
          </div>
          <div class="fs-55 fsm-30 mb-5 font-weight-black">
            Layanan Internet
          </div>
        </div>
        <VRow>
          <VCol
            v-for="(item, index) in our_features"
            :id="'features-item-' + index"
            cols="12"
            md="4"
            sm="12"
            data-wow-delay="0.2s"
          >
            <VCard class="h-100 feature-item">
              <VCardText class="pt-0">
                <div class="feature-icon px-4 py-6">
                  <i :class="item.icon" class="fa-3x bounce"></i>
                </div>
                <p class="mt-8 fs-25 fsm-20 font-weight-black">
                  {{ item.title }}
                </p>
                <p class="mt-5 fs-18 fsm-14">
                  {{ item.description }}
                </p>
                <VBtn size="small" color="primary" class="mt-5">
                  Pelajari Lebih Lanjut
                  <VMenu activator="parent" location="top" class="">
                    <VCard width="500">
                      <VCardItem>
                        <template #title>
                          <small class="font-weight-bold">
                            Mengapa {{ item.title }} Lebih Baik?
                          </small>
                        </template>
                      </VCardItem>
                      <VCardText>
                        <div class="d-flex flex-column gap-2">
                          <div
                            v-for="(d, index) in item.why"
                            class="d-flex gap-2"
                          >
                            <div>{{ index + 1 }}.</div>
                            <div>
                              <strong> {{ d.title }} </strong> :
                              {{ d.subtitle }}
                            </div>
                          </div>
                        </div>
                      </VCardText>
                    </VCard>
                  </VMenu>
                </VBtn>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <!-- HERO 3 -->
    <div
      id="subscribe"
      class="py-5"
      style="background-color: white; border-radius: 50px"
    >
      <VContainer fluid>
        <div
          id="subscribe-title"
          class="text-center mx-auto pb-5"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <div class="text-primary fs-25 fsm-18 font-weight-bold">
            Cara Berlangganan
          </div>
          <div class="fs-55 fsm-30 font-weight-black mb-5">
            Mudahnya Berlangganan, Aman dan Anti Ribet!
          </div>
        </div>
        <VTimeline
          :direction="
            isLessThanOverlayNavBreakpoint(windowWidth)
              ? 'vertical'
              : 'horizontal'
          "
          :side="
            isLessThanOverlayNavBreakpoint(windowWidth) ? 'end' : undefined
          "
        >
          <VTimelineItem
            v-for="(item, index) in subscribe_step"
            :dot-color="item.color"
            :icon="item.icon"
            fill-dot
          >
            <template v-slot:opposite>
              <span
                v-if="!isLessThanOverlayNavBreakpoint(windowWidth)"
                class="font-weight-black fs-25"
              >
                #{{ index + 1 }}. {{ item.title }}
              </span>
            </template>
            <VCard
              :id="'subscribe-item-' + index"
              :color="item.color"
              class="hover-scale-up cursor-pointer"
            >
              <VCardText
                class="d-flex align-center gap-3"
                :class="
                  isLessThanOverlayNavBreakpoint(windowWidth) ? 'flex-wrap' : ''
                "
              >
                <div class="text-center">
                  <img :src="item.image" alt="Image" style="height: 100px" />
                </div>
                <p class="text-muted fs-18">
                  {{ item.description }}
                </p>
              </VCardText>
            </VCard>
          </VTimelineItem>
        </VTimeline>
      </VContainer>
    </div>
    <!-- HERO 4 -->
    <div id="package" class="py-5">
      <VContainer>
        <div
          id="package-title"
          class="text-center mx-auto pb-5"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <div class="text-primary fs-25 fsm-18 font-weight-bold">
            Paket Langganan
          </div>
          <div class="fs-55 fsm-30 font-weight-black mb-5">
            Internet Tanpa Batas, Koneksi Tanpa Hambatan
          </div>
        </div>
        <div
          v-if="is_package_loading"
          class="d-flex gap-6 flex-wrap justify-center"
        >
          <VCard v-for="item in 3">
            <SkeletonLoader height="450px" width="350px" />
          </VCard>
        </div>
        <div v-else>
          <EmptyAlert
            v-if="package_data.length === 0"
            title="Mohon Maaf, Untuk Saat Ini Paket Sedang Tidak Tersedia"
          />
          <div v-else class="d-flex gap-6 flex-wrap justify-center">
            <VCard
              v-for="(item, index) in package_data"
              :id="'package-item' + index"
              width="350"
              class="hover-scale-up cursor-pointer d-flex flex-column"
            >
              <VCardItem>
                <template #title>
                  <span class="font-weight-black fsm-18">
                    Paket {{ item.name }}
                  </span>
                </template>
                <div class="fs-16 fsm-14 mt-3">
                  Rp{{ thousandSeparator(item?.price?.regular || 0) }}
                </div>
                <div class="mt-3">
                  <VChip
                    color="warning"
                    variant="tonal"
                    class="font-weight-black fsm-12"
                  >
                    Kecepatan Hingga {{ item.bandwidth }}Mbps
                  </VChip>
                </div>
              </VCardItem>
              <VDivider></VDivider>
              <div class="px-6 py-6 d-flex flex-column gap-5 flex-grow-1">
                <div>
                  <div class="d-flex gap-2 justify-space-between align-center">
                    <div class="fs-14 fsm-12 d-flex align-center gap-1">
                      <VIcon icon="tabler-tool" /> Biaya Pasang:
                    </div>
                    <div class="fs-16 font-weight-black">
                      <VChip v-if="item.instalation_cost" class="fsm-12">
                        Rp{{ thousandSeparator(item.instalation_cost) }}
                      </VChip>
                      <div v-else class="font-weight-black fsm-12">
                        GRATIS ✅
                      </div>
                    </div>
                  </div>
                  <div
                    class="mt-5 d-flex gap-2 justify-space-between align-center"
                  >
                    <div class="fs-14 fsm-12 d-flex align-center gap-1">
                      <VIcon icon="tabler-wallet" /> Mulai Dari:
                    </div>
                    <div class="fs-16 font-weight-black">
                      <VChip class="fsm-12">
                        Rp{{ thousandSeparator(item?.price?.regular) }}/Bulan
                      </VChip>
                    </div>
                  </div>
                  <div
                    class="mt-5 d-flex gap-2 justify-space-between align-center"
                  >
                    <div class="fs-14 fsm-12 d-flex align-center gap-1">
                      <VIcon icon="tabler-router" /> Perangkat:
                    </div>
                    <div class="fs-16 font-weight-black">
                      <VChip v-if="item.maximum_device" class="fsm-12">
                        1-{{ item.maximum_device }} Perangkat
                      </VChip>
                      <VChip v-else class="fsm-12"> Tidak Terbatas </VChip>
                    </div>
                  </div>
                  <VCard v-if="item.description" variant="tonal" class="mt-5">
                    <VCardText class="px-3 py-3 fs-12 text-center">
                      <div v-html="item.description"></div>
                    </VCardText>
                  </VCard>
                </div>
                <div class="mt-auto">
                  <VBtn
                    block
                    rounded="pill"
                    size="small"
                    color="success"
                    :to="{ name: 'register' }"
                  >
                    Daftar Sekarang
                  </VBtn>
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </VContainer>
    </div>
    <!-- HERO 5 -->
    <div
      id="area"
      class="py-5"
      style="background-color: white; border-radius: 50px 50px 0 0"
    >
      <VContainer>
        <div
          id="area-title"
          class="text-center mx-auto pb-5"
          style="max-width: 800px"
        >
          <div class="text-primary fs-25 fsm-18 font-weight-bold">
            Cakupan Area
          </div>
          <div class="fs-55 fsm-30 font-weight-black mb-5">
            Jangkauan Luas, Koneksi Stabil di Setiap Sudut
          </div>
        </div>
        <VCard id="area-item" variant="outlined">
          <GoogleMaps height="600px" :zoom="16">
            <template #marker>
              <Marker
                v-for="(item, index) in coverage_area_maps_data"
                :key="index"
                :options="{
                  position: {
                    lat: item?.address?.latitude || 0,
                    lng: item?.address?.longitude || 0,
                  },
                }"
                @mouseover="onMarkerHover(item, index)"
              >
                <InfoWindow v-if="marker_info_index === index">
                  <CoverageAreaMapInfo :data="item" />
                </InfoWindow>
              </Marker>
            </template>
          </GoogleMaps>
        </VCard>
      </VContainer>
    </div>
    <!-- FOOTER -->
    <div class="bg-footer">
      <VContainer>
        <div class="pt-5">
          <VRow>
            <VCol cols="12" md="4" sm="12">
              <div>
                <a href="#" class="p-0">
                  <div class="d-flex gap-2 align-center">
                    <img
                      src="/short-logo.png"
                      alt="Logo"
                      style="height: 40px"
                    />
                    <span class="mb-2 text-white font-weight-black">
                      AMRETA NET
                    </span>
                  </div>
                </a>
                <p class="text-white fsm-12 mb-4">
                  <VIcon icon="tabler-map-pin" class="mb-1" />
                  Jl. Pasirkuya No.88-47 Cipacing Kec. Jatinangor Kabupaten
                  Sumedang, Jawa Barat 45363, Indonesia
                </p>
              </div>
            </VCol>
            <VCol cols="6" md="4" sm="6">
              <div class="text-white">
                <h3 class="text-white mb-4 fsm-14">Tentang Kami</h3>
                <TermConditionModal>
                  <template #trigger-button>
                    <a class="cursor-pointer fsm-12"> Syarat & Ketentuan </a>
                  </template>
                </TermConditionModal>
                <PrivacyModal>
                  <template #trigger-button>
                    <a class="cursor-pointer fsm-12"> Kebijakan Privasi </a>
                  </template>
                </PrivacyModal>
              </div>
            </VCol>
            <VCol cols="6" md="4" sm="6">
              <div class="text-white">
                <h3 class="text-white mb-4 fsm-14">Hubungi Kami</h3>
                <a
                  href="mailto:sandi@amreta.net"
                  target="_blank"
                  class="fsm-12"
                >
                  <div class="d-flex align-center gap-1">
                    <VIcon icon="mdi-email" />
                    sandi@amreta.net
                  </div>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=628999094340"
                  target="_blank"
                  class="fsm-12"
                  rel="noopener noreferrer"
                >
                  <div class="d-flex align-center gap-1 mt-2">
                    <VIcon icon="mdi-whatsapp" />
                    <span>08999094340</span>
                  </div>
                </a>
              </div>
            </VCol>
          </VRow>
        </div>
      </VContainer>
    </div>
    <!-- COPYRIGHT -->
    <div class="bg-footer">
      <VContainer>
        <div class="d-flex justify-space-between fsm-12">
          <div>
            <span class="text-white">
              <a href="#"> Amreta Network </a>
              @ All right reserved {{ today.getFullYear() }}.
            </span>
          </div>
          <div class="text-white">Created by Mr. HS</div>
        </div>
      </VContainer>
    </div>
    <a href="#" class="back-to-top">
      <VBtn icon="mdi-arrow-up" rounded="circle" />
    </a>
  </div>
</template>
<style scoped>
.hero-1 {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 80vh;
  background-image: url("@/assets/images/illustrations/bg-hero-1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  transition: 0.5s;
  z-index: 99;
}
.bg-footer {
  background-color: #16243d;
  color: blanchedalmond;
}
/*** Feature Start ***/
.feature .feature-item {
  border-radius: 10px;
  background: #fff;
  transition: 0.5s;
}

.feature .feature-item:hover {
  background: #0083db;
}

.feature .feature-item .feature-icon {
  position: relative;
  width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #f2f5f9;
}

.feature .feature-item:hover .feature-icon i {
  z-index: 9;
}

.feature .feature-item .feature-icon::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 0;
  top: 0;
  left: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #16243d;
  transition: 0.5s;
  z-index: 1;
}

.feature .feature-item:hover .feature-icon::after {
  height: 100%;
}

.feature .feature-item .feature-icon {
  color: #0083db;
}

.feature .feature-item .feature-icon,
.feature .feature-item h4,
.feature .feature-item p {
  transition: 0.5s;
}

.feature .feature-item:hover .feature-icon {
  color: #fff;
}
.feature .feature-item:hover h4,
.feature .feature-item:hover p {
  color: #fff;
}

.feature .feature-item:hover a.btn {
  background: #fff;
  color: #0083db;
}

.feature .feature-item:hover a.btn:hover {
  background: #16243d;
  color: #fff;
}
/*** Feature End ***/
</style>
<route lang="yaml">
meta:
  title: Solusi Internet Unlimited
  layout: blank
  action: read
</route>
