<script lang="ts" setup>
import { stateManagement } from "@/store";
import { injectionKeyIsVerticalNavHovered, useLayouts } from "@layouts";
import { TransitionExpand, VerticalNavLink } from "@layouts/components";
import { config } from "@layouts/config";
import type { NavGroup } from "@layouts/types";
import { isNavGroupActive, openGroups } from "@layouts/utils";

const props = defineProps<{
  item: NavGroup;
}>();

defineOptions({
  name: "VerticalNavGroup",
});
const store = stateManagement();
const route = useRoute();
const router = useRouter();
const { width: windowWidth } = useWindowSize();
const { isVerticalNavMini, dynamicI18nProps } = useLayouts();
const hideTitleAndBadge = isVerticalNavMini(windowWidth);
const user_role = store.getUser.role;
const isVerticalNavHovered = inject(
  injectionKeyIsVerticalNavHovered,
  ref(false)
);

const isGroupActive = ref(false);
const isGroupOpen = ref(false);

/**
 * Checks if any of children group is open or not.
 * This is helpful in preventing closing inactive parent group when inactive child group is opened. (i.e. Do not close "Nav Levels" group if child "Nav Level 2.2" is opened/clicked)
 *
 * @param {NavGroup['children']} children  - Nav group children
 * @return {boolean} returns if any of children is open or not.
 */
const isAnyChildOpen = (children: NavGroup["children"]): boolean => {
  return children.some((child) => {
    let result = openGroups.value.includes(child.title);

    if ("children" in child) result = isAnyChildOpen(child.children) || result;

    return result;
  });
};

const collapseChildren = (children: NavGroup["children"]) => {
  children.forEach((child) => {
    if ("children" in child) collapseChildren(child.children);

    openGroups.value = openGroups.value.filter(
      (group) => group !== child.title
    );
  });
};

watch(
  () => route.path,
  () => {
    const isActive = isNavGroupActive(props.item.children, router);

    // Don't open group if vertical nav is collapsed and window size is more than overlay nav breakpoint
    isGroupOpen.value =
      isActive && !isVerticalNavMini(windowWidth, isVerticalNavHovered).value;
    isGroupActive.value = isActive;
  },
  { immediate: true }
);

watch(
  isGroupOpen,
  (val: boolean) => {
    // Find group index for adding/removing group from openGroups array
    const grpIndex = openGroups.value.indexOf(props.item.title);
    if (val && grpIndex === -1) {
      openGroups.value.push(props.item.title);
    }

    // If group is closed remove itself and its children from the `openGroups`
    else if (!val && grpIndex !== -1) {
      openGroups.value.splice(grpIndex, 1);
      collapseChildren(props.item.children);
    }
  },
  { immediate: true }
);

watch(
  openGroups,
  (val) => {
    // Prevent closing recently opened inactive group.
    const lastOpenedGroup = val[val.length - 1];
    if (lastOpenedGroup === props.item.title) return;

    const isActive = isNavGroupActive(props.item.children, router);

    // Goal of this watcher is to close inactive groups. So don't do anything for active groups.
    if (isActive) return;

    // We won't close group if any of child group is open in current group
    if (isAnyChildOpen(props.item.children)) return;

    isGroupOpen.value = isActive;
    isGroupActive.value = isActive;
  },
  { deep: true }
);

// ℹ️ Previously instead of below watcher we were using two individual watcher for `isVerticalNavHovered`, `isVerticalNavCollapsed` & `isLessThanOverlayNavBreakpoint`
watch(isVerticalNavMini(windowWidth, isVerticalNavHovered), (val) => {
  isGroupOpen.value = val ? false : isGroupActive.value;
});
</script>

<template>
  <li
    class="nav-group"
    :class="[
      {
        active: isGroupActive,
        open: isGroupOpen,
        disabled: item.disable,
      },
    ]"
  >
    <div
      v-if="item.access && item.access.includes(user_role)"
      class="nav-group-label"
      @click="isGroupOpen = !isGroupOpen"
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
          v-bind="dynamicI18nProps(item.title, 'span')"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="config.app.enableI18n ? 'i18n-t' : 'span'"
          v-bind="dynamicI18nProps(item.badgeContent, 'span')"
          v-show="!hideTitleAndBadge"
          v-if="item.badgeContent"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
        >
          {{ item.badgeContent }}
        </Component>
        <Component
          :is="config.app.iconRenderer || 'div'"
          v-show="!hideTitleAndBadge"
          v-bind="config.icons.chevronRight"
          key="arrow"
          class="nav-group-arrow"
        />
      </TransitionGroup>
    </div>
    <TransitionExpand>
      <ul v-show="isGroupOpen" class="nav-group-children">
        <Component
          :is="'children' in child ? 'VerticalNavGroup' : VerticalNavLink"
          v-for="child in item.children"
          :key="child.title"
          :item="child"
        />
      </ul>
    </TransitionExpand>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-group {
    &-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
