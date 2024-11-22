<script lang="ts" setup>
import { roleFormatter, stringCutter } from "@/modules";
import { stateManagement } from "@/store";
import { injectionKeyIsVerticalNavHovered, useLayouts } from "@layouts";
import {
  VerticalNavGroup,
  VerticalNavLink,
  VerticalNavSectionTitle,
} from "@layouts/components";
import type {
  NavGroup,
  NavLink,
  NavSectionTitle,
  VerticalNavItems,
} from "@layouts/types";
import type { Component } from "vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

interface Props {
  tag?: string | Component;
  navItems: VerticalNavItems;
  isOverlayNavActive: boolean;
  toggleIsOverlayNavActive: (value: boolean) => void;
}

const store = stateManagement();
const props = withDefaults(defineProps<Props>(), {
  tag: "aside",
});
const refNav = ref();
const { width: windowWidth } = useWindowSize();
const isHovered = useElementHover(refNav);

provide(injectionKeyIsVerticalNavHovered, isHovered);

const {
  isVerticalNavCollapsed: isCollapsed,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavMini,
  isAppRtl,
} = useLayouts();

const hideTitleAndIcon = isVerticalNavMini(windowWidth, isHovered);
const resolveNavItemComponent = (
  item: NavLink | NavSectionTitle | NavGroup
) => {
  if ("heading" in item) return VerticalNavSectionTitle;
  if ("children" in item) return VerticalNavGroup;

  return VerticalNavLink;
};
const route = useRoute();

watch(
  () => route.name,
  () => {
    props.toggleIsOverlayNavActive(false);
  }
);

const isVerticalNavScrolled = ref(false);
const updateIsVerticalNavScrolled = (val: boolean) =>
  (isVerticalNavScrolled.value = val);

const handleNavScroll = (evt: Event) => {
  isVerticalNavScrolled.value = (evt.target as HTMLElement).scrollTop > 0;
};
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        'overlay-nav': isLessThanOverlayNavBreakpoint(windowWidth),
        hovered: isHovered,
        visible: isOverlayNavActive,
        scrolled: isVerticalNavScrolled,
      },
    ]"
  >
    <div v-if="!hideTitleAndIcon" class="px-4 py-4">
      <VCard
        variant="outlined"
        class="border border-dashed border-info border-md bg-light-primary"
      >
        <div class="px-3 py-3 d-flex flex-column gap-2">
          <div class="text-center">
            <img src="/public/short-logo.png" style="height: 50px" />
            <div>
              <span class="font-weight-black text-black fs-22">AMRETA NET</span>
            </div>
          </div>
          <VDivider></VDivider>
          <div class="d-flex gap-2 align-center">
            <VAvatar
              color="primary"
              size="50"
              variant="tonal"
              icon="tabler-user"
            ></VAvatar>
            <div>
              <div class="fs-16 text-no-wrap">
                Hai,
                <strong>
                  {{ stringCutter(store.getUser.name || "Anonymous", 15) }}
                </strong>
              </div>
              <div>
                <VChip
                  variant="outlined"
                  size="x-small"
                  :color="roleFormatter(store.getUser.role).color"
                >
                  {{ roleFormatter(store.getUser.role).type }}
                </VChip>
              </div>
            </div>
          </div>
        </div>
      </VCard>
    </div>
    <div v-else class="px-3 py-3">
      <VCard
        variant="outlined"
        class="border border-dashed border-info border-md"
        style="display: grid; place-items: center"
      >
        <img src="/public/short-logo.png" class="mt-2" style="height: 50px" />
      </VCard>
    </div>
    <VBtn
      v-if="!isLessThanOverlayNavBreakpoint(windowWidth) && !hideTitleAndIcon"
      size="35"
      style="position: absolute; right: 0; top: 105px; margin-right: -10px"
      @click="isCollapsed = !isCollapsed"
    >
      <VIcon
        :icon="isCollapsed ? 'tabler-chevrons-left' : 'tabler-chevrons-right'"
      ></VIcon>
    </VBtn>
    <slot
      name="nav-items"
      :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled"
    >
      <PerfectScrollbar
        :key="isAppRtl"
        tag="ul"
        class="nav-items"
        :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll"
      >
        <Component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navItems"
          :key="index"
          :item="item"
        />
      </PerfectScrollbar>
    </slot>
  </Component>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

// 👉 Vertical Nav
.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: variables.$layout-vertical-nav-width;
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: transform 0.25s ease-in-out, inline-size 0.25s ease-in-out,
    box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;

    // ℹ️ We no loner needs this overflow styles as perfect scrollbar applies it
    // overflow-x: hidden;

    // // ℹ️ We used `overflow-y` instead of `overflow` to mitigate overflow x. Revert back if any issue found.
    // overflow-y: auto;
  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 👉 Collapsed
  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Overlay nav
  &.overlay-nav {
    &:not(.visible) {
      transform: translateX(-#{variables.$layout-vertical-nav-width});

      @include mixins.rtl {
        transform: translateX(variables.$layout-vertical-nav-width);
      }
    }
  }
}
</style>
