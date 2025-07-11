<script setup lang="tsx">
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { Skins } from "@core/enums";
import { AppContentLayoutNav, FooterType, NavbarType } from "@layouts/enums";
import { themeConfig } from "@themeConfig";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useTheme } from "vuetify";

const isNavDrawerOpen = ref(false);
const {
  theme,
  skin,
  appRouteTransition,
  navbarType,
  footerType,
  isVerticalNavCollapsed,
  isVerticalNavSemiDark,
  appContentWidth,
  appContentLayoutNav,
  isAppRtl,
  isNavbarBlurEnabled,
  isLessThanOverlayNavBreakpoint,
} = useThemeConfig();

// 👉 Primary Color
const vuetifyTheme = useTheme();
const initialThemeColors = JSON.parse(
  JSON.stringify(vuetifyTheme.current.value.colors)
);
const colors = ["primary", "secondary", "success", "info", "warning", "error"];

// ℹ️ It will set primary color for current theme only
const setPrimaryColor = (color: string) => {
  const currentThemeName = vuetifyTheme.name.value;

  vuetifyTheme.themes.value[currentThemeName].colors.primary = color;

  // ℹ️ We need to store this color value in localStorage so vuetify plugin can pick on next reload
  localStorage.setItem(
    `${themeConfig.app.title}-${currentThemeName}ThemePrimaryColor`,
    color
  );

  // ℹ️ Update initial loader color
  localStorage.setItem(`${themeConfig.app.title}-initial-loader-color`, color);
};

/*
  ℹ️ This will return static color for first indexed color based on theme
  If we don't make first (primary) color as static then when another color is selected then we will have two theme colors with same hex codes and it will show two check marks
*/
const getBoxColor = (color: string, index: number) =>
  index ? color : "#0083db";

const { width: windowWidth } = useWindowSize();

const headerValues = computed(() => {
  const entries = Object.entries(NavbarType);

  if (appContentLayoutNav.value === AppContentLayoutNav.Horizontal)
    return entries.filter(([_, val]) => val !== NavbarType.Hidden);

  return entries;
});
</script>

<template>
  <template v-if="!isLessThanOverlayNavBreakpoint(windowWidth)">
    <VBtn
      icon
      size="small"
      class="app-customizer-toggler rounded-s-lg rounded-0"
      style="z-index: 1001"
      @click="isNavDrawerOpen = true"
    >
      <VIcon icon="tabler-settings" />
    </VBtn>

    <VNavigationDrawer
      v-model="isNavDrawerOpen"
      temporary
      location="end"
      width="400"
      :scrim="false"
      class="app-customizer"
    >
      <!-- 👉 Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">Konfigurasi Tema</h6>
          <span class="text-body-1"
            >Ubah konfigurasi tema secara real time</span
          >
        </div>
        <VBtn
          icon
          variant="text"
          color="secondary"
          size="x-small"
          @click="isNavDrawerOpen = false"
        >
          <VIcon icon="tabler-x" size="20" />
        </VBtn>
      </div>
      <VDivider />
      <PerfectScrollbar tag="ul" :options="{ wheelPropagation: false }">
        <CustomizerSection title="THEMES" :divider="false">
          <h6 class="text-base font-weight-regular">Skins</h6>
          <VRadioGroup v-model="skin" inline>
            <VRadio
              v-for="[key, val] in Object.entries(Skins)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>

          <!-- 👉 Theme -->
          <h6 class="mt-3 text-base font-weight-regular">Theme</h6>
          <div class="d-flex align-center">
            <VLabel for="pricing-plan-toggle" class="me-3"> Light </VLabel>

            <div>
              <VSwitch
                id="pricing-plan-toggle"
                v-model="theme"
                label="Dark"
                true-value="dark"
                false-value="light"
              />
            </div>
          </div>

          <!-- 👉 Primary color -->
          <h6 class="mt-3 text-base font-weight-regular">Primary Color</h6>
          <div class="d-flex gap-x-4 mt-2">
            <div
              v-for="(color, index) in colors"
              :key="color"
              style="
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 0.5rem;
                transition: all 0.25s ease;
              "
              :style="{
                backgroundColor: getBoxColor(initialThemeColors[color], index),
              }"
              class="cursor-pointer d-flex align-center justify-center"
              :class="{
                'elevation-4':
                  vuetifyTheme.current.value.colors.primary ===
                  getBoxColor(initialThemeColors[color], index),
              }"
              @click="
                setPrimaryColor(getBoxColor(initialThemeColors[color], index))
              "
            >
              <VFadeTransition>
                <VIcon
                  v-show="
                    vuetifyTheme.current.value.colors.primary ===
                    getBoxColor(initialThemeColors[color], index)
                  "
                  icon="tabler-check"
                  color="white"
                />
              </VFadeTransition>
            </div>
          </div>
        </CustomizerSection>
        <CustomizerSection title="LAYOUT">
          <!-- 👉 Navbar Type -->
          <h6 class="mt-3 text-base font-weight-regular">
            Tipe
            {{
              appContentLayoutNav === AppContentLayoutNav.Vertical
                ? "Navbar"
                : "Header"
            }}
          </h6>
          <VRadioGroup v-model="navbarType" inline>
            <VRadio
              v-for="[key, val] in headerValues"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <h6 class="mt-3 text-base font-weight-regular">Tipe Footer</h6>
          <VRadioGroup v-model="footerType" inline>
            <VRadio
              v-for="[key, val] in Object.entries(FooterType)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
        </CustomizerSection>
        <CustomizerSection title="MENU">
          <!-- <h6 class="text-base font-weight-regular">Tipe Menu</h6>
          <VRadioGroup v-model="appContentLayoutNav" inline>
            <VRadio
              v-for="[key, val] in Object.entries(AppContentLayoutNav)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <div
            v-if="appContentLayoutNav === AppContentLayoutNav.Vertical"
            class="d-flex align-center justify-space-between"
          >
            <VLabel for="customizer-menu-collapsed" class="text-high-emphasis">
              Collapsed Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-collapsed"
                v-model="isVerticalNavCollapsed"
                class="ms-2"
              />
            </div>
          </div> -->
          <!-- 👉 Semi Dark Menu -->
          <div
            class="align-center justify-space-between"
            :class="
              theme === 'light' &&
              appContentLayoutNav === AppContentLayoutNav.Vertical
                ? 'd-flex'
                : 'd-none'
            "
          >
            <VLabel for="customizer-menu-semi-dark" class="text-high-emphasis">
              Semi Dark Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-semi-dark"
                v-model="isVerticalNavSemiDark"
                class="ms-2"
              />
            </div>
          </div>
        </CustomizerSection>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </template>
</template>

<style lang="scss">
.app-customizer {
  .customizer-section {
    padding: 1.25rem;
  }

  .customizer-heading {
    padding-block: 0.875rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-customizer-toggler {
  position: fixed !important;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);

  &:active {
    transform: translateY(-50%) !important;
  }
}
</style>
