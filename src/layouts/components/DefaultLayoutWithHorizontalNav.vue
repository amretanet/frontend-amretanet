<script lang="ts" setup>
import navItems from "@/navigation/horizontal";
import { useThemeConfig } from "@core/composable/useThemeConfig";

// Components
import Footer from "@/layouts/components/Footer.vue";
import TheCustomizer from "@/page-components/TheCustomizer.vue";
import Notification from "@/page-components/navbar/Notification.vue";
import ThemeSwitcher from "@/page-components/navbar/ThemeSwitcher.vue";
import UserProfile from "@/page-components/navbar/UserProfile.vue";
import { HorizontalNavLayout } from "@layouts";

const { appRouteTransition } = useThemeConfig();
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink to="/" class="app-logo d-flex align-center gap-x-3">
        <img src="/public/logo.png" style="height: 25px" />
        <Transition name="vertical-nav-app-title">
          <h1 class="app-title font-weight-bold leading-normal text-xl">
            Apps Name
          </h1>
        </Transition>
      </RouterLink>
      <VSpacer />

      <ThemeSwitcher />
      <Notification class="me-2" />
      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component, route }">
      <Transition :name="appRouteTransition" mode="out-in">
        <Component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </HorizontalNavLayout>
</template>
