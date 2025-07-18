import { breakpointsVuetify } from "@vueuse/core";

import { VIcon } from "vuetify/components";

// ❗ Logo SVG must be imported with ?raw suffix
import logo from "@images/logo.svg?raw";

import { defineThemeConfig } from "@core";
import { RouteTransitions, Skins } from "@core/enums";
import {
  AppContentLayoutNav,
  ContentWidth,
  FooterType,
  NavbarType,
} from "@layouts/enums";

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: "amreta-net",
    logo: h("div", {
      innerHTML: logo,
      style: "line-height:0; color: rgb(var(--v-global-theme-primary))",
    }),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav:
      localStorage.getItem("navigation-type") || AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16, // 16 for scrollbar. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
    enableI18n: false,
    theme: "dark",
    isRtl: false,
    skin: Skins.Default,
    routeTransition: RouteTransitions["Scroll X"],
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: "tabler-circle", size: 10 },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: "sticky",
    transition: "slide-y-reverse-transition",
  },
  icons: {
    chevronDown: { icon: "tabler-chevron-down" },
    chevronRight: { icon: "tabler-chevron-right", size: 18 },
    close: { icon: "tabler-x" },
    verticalNavPinned: {
      icon: "tabler-square-rounded-chevrons-right",
      size: 30,
    },
    verticalNavUnPinned: {
      icon: "tabler-square-rounded-chevrons-left",
      size: 30,
    },
    sectionTitlePlaceholder: { icon: "tabler-separator" },
  },
});
