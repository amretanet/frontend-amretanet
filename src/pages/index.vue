<script setup lang="ts">
import download_upload_image from "@/assets/images/illustrations/download-upload.png";
import fiber_optic_image from "@/assets/images/illustrations/fiber-optic.png";
import instalation_image from "@/assets/images/illustrations/instalation.png";
import payment_image from "@/assets/images/illustrations/payment.png";
import registration_image from "@/assets/images/illustrations/registration.png";
import unlimited_image from "@/assets/images/illustrations/unlimited.png";
import { thousandSeparator } from "@/modules";
import ThemeSwitcher from "@/page-components/navbar/ThemeSwitcher.vue";
import TermConditionModal from "@/page-components/TermConditionModal.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";

const router = useRouter();
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const today = new Date();
const is_drawer_open = ref(false);
const current_nav = ref("Home");
const navigations = ref([
  {
    icon: "tabler-home",
    to: "#home",
    name: "Home",
  },
  {
    icon: "tabler-home",
    to: "#media",
    name: "Media",
  },
  // {
  //   icon: "tabler-address-book",
  //   to: "#rules",
  //   name: "Syarat",
  // },
  // {
  //   icon: "tabler-user-shield",
  //   to: "#privacy",
  //   name: "Privasi",
  // },
  {
    icon: "tabler-rosette-discount",
    to: "#promo",
    name: "Promo",
  },
  {
    icon: "tabler-map-pin",
    to: "#area",
    name: "Area",
  },
]);
const subscribe_step = ref([
  {
    icon: "tabler-list-details",
    image: registration_image,
    title: "Registrasi",
    description:
      "Cek area lokasi pemasangan, pilih paket, dan pilih jadwal pemasangan.",
  },
  {
    icon: "tabler-tools",
    image: instalation_image,
    title: "Instalasi",
    description: "Lacak proses instalasi kemudian nikmati layanan AMRETA NET.",
  },
  {
    icon: "tabler-wallet",
    image: payment_image,
    title: "Pembayaran",
    description: "Bayar tagihan dan nikmati kecepatan layanan AMRETA NET.",
  },
]);
const advantages = ref([
  {
    image: fiber_optic_image,
    title: "100%",
    subtitle: "Fiber Optic",
  },
  {
    image: download_upload_image,
    title: "1 : 1",
    subtitle: "Download : Upload",
  },
  {
    image: unlimited_image,
    title: "100%",
    subtitle: "Unlimited",
  },
]);
const packages = ref([
  {
    name: "Hemat",
    bandwidth: "7 Mbps",
    price: 140000,
    pricing_type: "Bulan",
    instalation_price: 100000,
    max_connected_device: 2,
    is_popular: false,
  },
  {
    name: "Medium",
    bandwidth: "20 Mbps",
    price: 240000,
    pricing_type: "Bulan",
    instalation_price: 0,
    max_connected_device: 5,
    is_popular: true,
  },
  {
    name: "Boost",
    bandwidth: "50 Mbps",
    price: 140000,
    pricing_type: "Bulan",
    instalation_price: 0,
    max_connected_device: 10,
    is_popular: false,
  },
  {
    name: "Speed",
    bandwidth: "15 Mbps",
    price: 175000,
    pricing_type: "Bulan",
    instalation_price: 0,
    max_connected_device: 4,
    is_popular: false,
  },
  {
    name: "November Sale Hemat",
    bandwidth: "8 Mbps",
    price: 140000,
    pricing_type: "Bulan",
    instalation_price: 0,
    max_connected_device: 2,
    is_popular: false,
  },
  {
    name: "November Sale Boost",
    bandwidth: "30 Mbps",
    price: 250000,
    pricing_type: "Bulan",
    instalation_price: 0,
    max_connected_device: 6,
    is_popular: false,
  },
]);
const our_contact = ref([
  {
    icon: "tabler-brand-instagram",
    color: "error",
    media: "Instagram",
    url: "instagram.com",
  },
  {
    icon: "tabler-brand-facebook",
    color: "primary",
    media: "Facebook",
    url: "facebook.com",
  },
  {
    icon: "tabler-brand-whatsapp",
    color: "success",
    media: "Whatsapp",
    url: "whatsapp.com",
  },
  {
    icon: "tabler-mail",
    color: "error",
    media: "Email",
    url: "email.com",
  },
]);

// function
const letsLogin = () => {
  router.push("/login");
  // let temp  = ""
  // for(let i=1;i<=100;i++){
    
  //   const data = `.fsm-${i}{font-size:${i}px !important}`
  //   temp += data
  // }
  // console.log(temp)
};
const redirectToOurContact = (url: string) => {
  window.open(url);
};
</script>
<template>
  <div>
    <VAppBar height="80" variant="tonal" prominent>
      <VContainer>
        <div
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          class="d-flex align-center"
          style="justify-content: space-between"
        >
          <div class="d-flex gap-2 align-center">
            <img src="/public/logo.png" height="30" alt="" />
          </div>
          <VSpacer></VSpacer>
          <ThemeSwitcher />
          <VBtn
            color="dark"
            icon
            size="small"
            @click="is_drawer_open = !is_drawer_open"
          >
            <VIcon icon="tabler-menu-2" />
          </VBtn>
        </div>
        <div
          v-else
          class="d-flex align-center gap-5"
          style="justify-content: space-between"
        >
          <div class="d-flex gap-2 align-center">
            <img src="/public/logo.png" height="30" alt="" />
          </div>
          <VSpacer></VSpacer>
          <div class="d-flex gap-2">
            <VBtn
              v-for="nav in navigations"
              variant="text"
              :color="nav.name === current_nav ? 'primary' : 'dark'"
              :active="nav.name === current_nav"
              :to="nav.to"
              @click="current_nav = nav.name"
            >
              {{ nav.name }}
            </VBtn>
          </div>
          <VSpacer></VSpacer>
          <div class="d-flex align-center gap-1">
            <ThemeSwitcher />
            <VBtn
              rounded="pill"
              variant="flat"
              size="small"
              color="primary"
              prepend-icon="tabler-login-2"
              @click="letsLogin()"
            >
              Login
            </VBtn>
          </div>
        </div>
      </VContainer>
    </VAppBar>
    <VContainer class="hero-section">
      <VRow>
        <VCol cols="12" class="text-center">
          <div class="fs-60 fsm-35 text-primary font-weight-black">Amreta Network</div>
          <div class="font-weight-black text-warning fs-40 fsm-20 mt-1">
            Solusi Internet Cepat, Untuk Aktivitas Tanpa Batas
          </div>
          <div class="fs-20 fsm-12 mt-5 font-weight-bold">
            Miliki layanan internet bebas akses internet stabil terbaik di rumah
            Anda sekarang juga.
          </div>
        </VCol>
      </VRow>
      <VRow class="mt-10">
        <VCol v-for="item in advantages" cols="12" md="4" sm="12">
          <VCard class="rounded-custom-xl scale-up">
            <VCardText class="text-center">
              <div class="py-5">
                <img
                  :src="item.image"
                  :alt="item.subtitle"
                  style="height: 10rem"
                />
              </div>
              <VDivider></VDivider>
              <div class="fs-30 fsm-20 font-weight-bold mt-2">
                {{ item.title }}
              </div>
              <div class="fs-25 fsm-16">{{ item.subtitle }} ✅</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer fluid class="mt-10 subscribe-step">
      <VRow>
        <VCol cols="12" class="text-center">
          <div class="font-weight-black fs-40 fsm-30 mt-2">Cara Berlangganan</div>
          <div class="fs-20 fsm-14 mt-2">
            Ikuti {{ subscribe_step.length }} langkah mudah untuk mulai
            menikmati internet stabil tanpa batas
          </div>
        </VCol>
        <VCol cols="12" class="slide-in">
          <VTimeline
            :direction="
              isLessThanOverlayNavBreakpoint(windowWidth)
                ? 'vertical'
                : 'horizontal'
            "
            side="end"
          >
            <VTimelineItem
              v-for="(item, index) in subscribe_step"
              :icon="item.icon"
              dot-color="primary"
              fill-dot
            >
              <VCard class="rounded-custom-xl h-100">
                <VCardText>
                  <div
                    class="d-flex gap-3"
                    :class="
                      isLessThanOverlayNavBreakpoint(windowWidth)
                        ? 'flex-column text-center'
                        : ''
                    "
                  >
                    <div>
                      <img
                        :src="item.image"
                        alt="Registration"
                        style="height: 120px; width: auto; object-fit: cover"
                      />
                    </div>
                    <div>
                      <div class="fs-24 fsm-16 font-weight-bold pb-2">
                        {{ index + 1 }}. {{ item.title }}
                      </div>
                      <VDivider></VDivider>
                      <div class="pt-2 fsm-12">{{ item.description }}</div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VTimelineItem>
          </VTimeline>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer class="mt-10">
      <div class="py-5 text-center">
        <div class="fs-40 fsm-25 font-weight-black">Daftar Paket</div>
      </div>
      <div class="d-flex gap-5 flex-wrap justify-center">
        <VCard v-for="item in packages" width="350" class="h-100 scale-up">
          <VCardItem>
            <template #title>
              <div class="font-weight-black fsm-16">Paket {{ item.name }}</div>
              <div class="fs-16 fsm-12 mt-3">
                Rp{{ thousandSeparator(item.price) }}
              </div>
              <div class="mt-3">
                <VChip
                  color="primary"
                  variant="tonal"
                  class="font-weight-black fsm-10"
                >
                  Kecepatan Hingga {{ item.bandwidth }}
                </VChip>
              </div>
            </template>
          </VCardItem>
          <VDivider></VDivider>
          <VCardText>
            <div class="d-flex gap-2 justify-space-between align-center">
              <div class="fs-14 fsm-10 d-flex align-center gap-1">
                <VIcon icon="tabler-tool" /> Biaya Pasang:
              </div>
              <div class="fs-16 font-weight-black">
                <VChip v-if="item.instalation_price" class="fsm-12">
                  Rp{{ thousandSeparator(item.instalation_price) }}
                </VChip>
                <div v-else class="font-weight-black fsm-12">GRATIS ✅</div>
              </div>
            </div>
            <div class="mt-5 d-flex gap-2 justify-space-between align-center">
              <div class="fs-14 fsm-10 d-flex align-center gap-1">
                <VIcon icon="tabler-wallet" /> Mulai Dari:
              </div>
              <div class="fs-16 font-weight-black">
                <VChip class="fsm-12">
                  Rp{{ thousandSeparator(item.price) }}/{{ item.pricing_type }}
                </VChip>
              </div>
            </div>
            <div class="mt-5 d-flex gap-2 justify-space-between align-center">
              <div class="fs-14 fsm-10 d-flex align-center gap-1">
                <VIcon icon="tabler-router" /> Perangkat:
              </div>
              <div class="fs-16 font-weight-black">
                <VChip class="fsm-12"> 1-{{ item.max_connected_device }} Perangkat </VChip>
              </div>
            </div>
            <VBtn block rounded="pill" size="small" class="mt-10"> Daftar Sekarang </VBtn>
          </VCardText>
        </VCard>
      </div>
    </VContainer>
    <VFooter class="mt-10">
      <VContainer>
        <div class="d-flex flex-wrap gap-2 justify-space-between">
          <div>
            <span class="fs-18 fsm-12">
              Amreta Network @ All Right Reserved {{ today.getFullYear() }}
            </span>
          </div>
          <div class="d-flex fsm-10 gap-5">
            <TermConditionModal>
              <template #trigger-button>
                <div class="clickable text-primary">Syarat & Privasi</div>
              </template>
            </TermConditionModal>
            <div class="clickable text-primary">
              Hubungi Kami
              <VMenu activator="parent">
                <VCard>
                  <VCardText>
                    <div class="d-flex gap-3">
                      <div v-for="item in our_contact" class="clickable">
                        <VAvatar
                          :color="item.color"
                          :icon="item.icon"
                          @click="redirectToOurContact(item.url)"
                        />
                        <VTooltip activator="parent">
                          {{ item.media }}
                        </VTooltip>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VMenu>
            </div>
          </div>
        </div>
      </VContainer>
    </VFooter>
    <VNavigationDrawer
      v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
      v-model="is_drawer_open"
      temporary
      location="start"
      width="200"
    >
      <VCardText class="mt-5">
        <VList class="card-list">
          <VListItem v-for="nav in navigations" :key="nav.name">
            <template #prepend>
              <VIcon :size="14" :icon="nav.icon" class="me-3" />
            </template>
            <VListItemTitle>
              {{ nav.name }}
            </VListItemTitle>
          </VListItem>
        </VList>
        <div class="mt-5">
          <VBtn block size="small"> Login </VBtn>
        </div>
      </VCardText>
    </VNavigationDrawer>
  </div>
</template>
<style scoped>
.hero-section {
  padding-top: 200px;
}
.rounded-custom-xl {
  border-radius: 50px !important;
}
.subscribe-step {
  padding: 100px 0 100px 0;
  border-radius: 100px;
  background-color: rgba(255, 255, 255, 1);
}
.v-theme--dark .subscribe-step {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
<route lang="yaml">
meta:
  title: Solusi Internet Unlimited
  layout: blank
  action: read
</route>
