<script setup lang="ts">
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import registrationForm from "@images/illustrations/registration-form.png";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import RegisterCustomerForm from "@/page-components/customer/RegisterCustomerForm.vue";

// VARIABLE
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="6" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="441"
            :src="registrationForm"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>
    <VCol cols="12" lg="6" class="d-flex align-center justify-center">
      <VCard flat :max-width="600" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <div class="text-center">
            <VImg src="/short-logo.png" alt="Logo" style="height: 150px" />
            <div class="fs-30 font-weight-black">AMRETA NET</div>
            <div class="mt-10 font-italic text-disabled">
              Pastikan data yang dimasukkan benar dan belum pernah dipakai pada
              Layanan AMRETA NET
            </div>
          </div>
        </VCardText>
        <VCardText class="mt-3">
          <VCard>
            <VCardText>
              <RegisterCustomerForm />
              <div class="mt-5">
                Sudah Punya Akun?
                <RouterLink
                  :to="{ name: 'login' }"
                  class="text-primary clickable"
                >
                  Silahkan Masuk
                </RouterLink>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  title: Registrasi
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
