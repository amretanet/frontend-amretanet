<script setup lang="ts">
import autloginIllustration from "@/assets/images/illustrations/user-protection.png";
import { errorMessage, showActionResult } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { emailValidator, requiredValidator } from "@validators";
import { VForm } from "vuetify/components";

// VARIABLE
const store = stateManagement();
const router = useRouter();
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const is_show_password = ref(false);
const is_loading = ref(false);
const login_form = ref<VForm>();
const login_data = ref({
  email: "",
  password: "",
});

// FUNCTION
const loginSuccess = () => {
  // if (store.isAdmin) {
  router.push("managements/dashboard");
  // }
};
const onSubmit = () => {
  login_form.value?.validate().then(({ valid: is_valid }) => {
    if (is_valid) {
      is_loading.value = true;
      const params = new FormData();
      params.append("username", login_data.value.email);
      params.append("password", login_data.value.password);
      axiosIns
        .post("auth/login", params)
        .then((res) => {
          store.tokenHandler(res.data.access_token, res.data.refresh_token);
          store.userHandler(res.data.user_data);
          loginSuccess();
        })
        .catch((err) => {
          const message = errorMessage(err);
          showActionResult(true, "error", message, 1500);
        })
        .finally(() => {
          is_loading.value = false;
        });
    }
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            :src="autloginIllustration"
            class="auth-illustration mt-16 mb-2"
          />
        </div>
        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>
    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <div class="text-center">
            <div>
              <img
                src="@/assets/images/illustrations/shield.png"
                alt=""
                style="width: 70%"
              />
            </div>
            <div>
              <img src="/logo.png" alt="Logo" style="width: 80%" />
            </div>
          </div>
        </VCardText>
        <VCardText class="mt-10">
          <VForm ref="login_form" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="login_data.email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="login_data.password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="is_show_password ? 'text' : 'password'"
                  :append-inner-icon="
                    is_show_password ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="is_show_password = !is_show_password"
                />

                <div
                  class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"
                >
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Lupa Password?
                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  <template #prepend>
                    <VIcon
                      v-if="is_loading"
                      icon="tabler-refresh"
                      class="rotating-element"
                    />
                  </template>
                  {{ is_loading ? "Memeriksa Kredensial..." : "Masuk" }}
                </VBtn>
              </VCol>
              <!-- create account -->
              <VCol cols="12" class="text-center">
                <span>Belum punya akun?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Buat Akun
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
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
  title: Login
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
