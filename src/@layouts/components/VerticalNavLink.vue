<script lang="ts" setup>
import { stateManagement } from "@/store";
import { useLayouts } from "@layouts";
import { config } from "@layouts/config";
import type { NavLink } from "@layouts/types";
import { getComputedNavLinkToProp, isNavLinkActive } from "@layouts/utils";

defineProps<{
  item: NavLink;
}>();

const { width: windowWidth } = useWindowSize();
const { isVerticalNavMini, dynamicI18nProps } = useLayouts();

const hideTitleAndBadge = isVerticalNavMini(windowWidth);
const store = stateManagement();
const user_role = store.getUser.role;
</script>

<template>
  <li class="nav-link" :class="{ disabled: item.disable }">
    <Component
      v-if="item.access && item.access.includes(user_role)"
      :is="item.to ? 'RouterLink' : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :class="{
        'router-link-active router-link-exact-active': isNavLinkActive(
          item,
          $router
        ),
      }"
    >
      <Component
        :is="config.app.iconRenderer || 'div'"
        v-bind="item.icon || 'tabler-circle'"
        class="nav-item-icon"
      />
      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is="config.app.enableI18n ? 'i18n-t' : 'span'"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
          v-bind="dynamicI18nProps(item.title, 'span')"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="config.app.enableI18n ? 'i18n-t' : 'span'"
          v-if="item.badgeContent"
          v-show="!hideTitleAndBadge"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
          v-bind="dynamicI18nProps(item.badgeContent, 'span')"
        >
          {{ item.badgeContent }}
        </Component>
      </TransitionGroup>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}
</style>
