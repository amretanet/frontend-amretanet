<script setup lang="ts">
import { useThemeConfig } from "@/@core/composable/useThemeConfig";

// INTERFACE
interface IProps {
  title: string;
  value?: any;
  title_cols?: any;
  value_cols?: any;
}

// VARIABLE
const props = defineProps<IProps>();
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
</script>

<template>
  <div :class="isLessThanOverlayNavBreakpoint(windowWidth) ? 'mb-2' : ''">
    <VRow>
      <VCol
        cols="12"
        :md="title_cols || 4"
        :class="!isLessThanOverlayNavBreakpoint(windowWidth) ? 'pe-0' : 'pb-0'"
      >
        <div
          class="d-flex gap-1 text-no-wrap"
          :class="
            !isLessThanOverlayNavBreakpoint(windowWidth)
              ? 'justify-space-between'
              : ''
          "
        >
          <slot name="title">
            <div class="text-wrap">
              {{ props.title }}
            </div>
          </slot>
          <div>:</div>
        </div>
      </VCol>
      <VCol
        cols="12"
        :md="value_cols || 8"
        :class="!isLessThanOverlayNavBreakpoint(windowWidth) ? 'ps-1' : 'pt-1'"
      >
        <slot name="value">
          <div class="text-wrap">
            <strong>{{ props.value }}</strong>
          </div>
        </slot>
      </VCol>
    </VRow>
  </div>
</template>
