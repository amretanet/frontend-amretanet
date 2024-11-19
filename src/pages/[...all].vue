<script setup lang="ts">
import pageNotFound from "@/assets/images/illustrations/page-not-found.png";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import miscMaskDark from "@images/pages/misc-mask-dark.png";
import miscMaskLight from "@images/pages/misc-mask-light.png";

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark);
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-title="Halaman Tidak Ditemukan ❌"
      error-description="Kami tidak dapat menemukan halaman yang anda maksud "
    />
    <VBtn to="/managements/dashboard" class="mb-12"> Kembali Ke Home </VBtn>
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pageNotFound"
        alt="404-PageNotFound"
        :max-height="500"
        class="mx-auto"
      />
    </div>

    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
