<script setup lang="ts">
import { useThemeConfig } from "@core/composable/useThemeConfig";
import type { ThemeSwitcherTheme } from "@layouts/types";

// const props = defineProps<{
//   themes: ThemeSwitcherTheme[]
// }>()
const themes: ThemeSwitcherTheme[] = [
  {
    name: "light",
    icon: "tabler-sun-high",
  },
  {
    name: "dark",
    icon: "tabler-moon",
  },
];

const { theme } = useThemeConfig();
const {
  state: currentTheme,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(
  themes.map((t) => t.name),
  { initialValue: theme.value }
);

const changeTheme = () => {
  theme.value = getNextThemeName();
};

const getThemeIcon = computedWithControl(theme, () => {
  const nextThemeIndex =
    currentThemeIndex.value + 1 === themes.length
      ? 0
      : currentThemeIndex.value + 1;

  return themes[nextThemeIndex].icon;
});

watch(theme, (val) => {
  currentTheme.value = val;
});
</script>

<template>
  <VBtn icon variant="text" color="default" size="small" @click="changeTheme">
    <VIcon :icon="getThemeIcon" size="24" />
  </VBtn>
</template>
