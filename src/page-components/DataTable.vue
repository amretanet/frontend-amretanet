<script setup lang="ts">
import {
  dataCountFormatter,
  numberItemListFormatter,
  setPaginationLength,
  thousandSeparator,
} from "@/modules/index";
import { isNumber } from "@vueuse/core";
import EmptyAlert from "./EmptyAlert.vue";
import SkeletonLoader from "./SkeletonLoader.vue";

// INTERFACE
interface ITableHeader {
  title: string;
  key: string;
  th_class?: string;
  td_class?: string;
  width?: string;
  icon?: string;
}
interface IProps {
  headers: Array<ITableHeader>;
  body: Array<any>;
  items: number;
  keyword?: any;
  height?: string;
  hide_pagination?: boolean;
  is_loading: boolean;
}

// VARIABLE
const props = defineProps<IProps>();
const check_key_search = computed(() => {
  const data = data_body.value.filter((el) => {
    const keyword_search = keyword.value.toLowerCase().trim();
    for (const key in el) {
      if (el.hasOwnProperty(key)) {
        if (el[key]?.toString().toLowerCase().includes(keyword_search)) {
          return true;
        }
      }
    }

    return false;
  });
  return data;
});
const data_body = ref(props.body || []);
const data_body_show = computed(() => {
  const data = check_key_search.value;
  if (data_body.value && data_body.value.length > 0) {
    if (data_body_show) {
      const sliced_array = [];
      for (let i = 0; i < data.length; i += items.value) {
        const chunk = data.slice(i, i + items.value);
        sliced_array.push(chunk);
      }
      return sliced_array[page.value - 1];
    } else {
      return [];
    }
  } else {
    return [];
  }
});
const is_loading = ref(props.is_loading);
const items = ref(props.items || 10);
const keyword = ref(props.keyword || "");
const headers = ref(props.headers || []);
const height = ref(props.height || "260px");
const hide_pagination = ref(props.hide_pagination || false);
const page = ref(1);

// FUNCTION

// LIFECYCLE HOOKS
watch(props, () => {
  page.value = 1;
  keyword.value = props.keyword || "";
  items.value = props.items || 10;
  headers.value = props.headers || [];
  height.value = props.height || "260px";
  data_body.value = props.body || [];
  hide_pagination.value = props.hide_pagination || false;
  is_loading.value = props.is_loading;
});
</script>
<template>
  <div>
    <div class="scroller-table" :style="{ 'max-height': height || 'auto' }">
      <table class="table-custom">
        <thead>
          <tr>
            <th
              v-for="(item, index) in headers"
              :key="index"
              class="font-weight-bold"
              :class="item.th_class"
              :style="{ width: item.width || '' }"
            >
              <slot :name="`head-${item.title}`">
                {{ item.title }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="is_loading" v-for="item in items" :key="item">
            <td
              v-for="data in headers"
              :key="data.key"
              :class="data.td_class"
              class="py-1"
            >
              <SkeletonLoader height="28px" rounded="5px" />
            </td>
          </tr>
          <tr v-else v-for="(item, index) in data_body_show" :key="index">
            <td v-for="data in headers" :key="data.key" :class="data.td_class">
              <span>
                <slot :name="`cell-${data.key}`" :index="index" :data="item">
                  <span v-if="data.key == 'no'">
                    {{ numberItemListFormatter(index, page, items) }}
                  </span>
                  <span v-else>
                    {{
                      item[data.key]
                        ? isNumber(item[data.key])
                          ? thousandSeparator(item[data.key])
                          : item[data.key]
                        : item[data.key] == 0
                        ? 0
                        : "-"
                    }}
                  </span>
                </slot>
              </span>
            </td>
          </tr>
          <tr
            v-if="
              !is_loading &&
              (data_body_show == null || data_body_show.length == 0)
            "
          >
            <td :colspan="headers.length || 0" class="text-center px-2 py-2">
              <EmptyAlert />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <VCardText class="pt-2">
      <slot name="pagination">
        <div v-if="!hide_pagination" class="d-flex align-center">
          <h6 class="fs-14 fw-500">
            {{
              dataCountFormatter(
                page,
                items,
                check_key_search.length || 0,
                data_body_show ? data_body_show.length : 0
              )
            }}
          </h6>
          <VPagination
            v-model="page"
            :length="setPaginationLength(items, check_key_search.length || 0)"
            :total-visible="3"
            size="small"
            class="ms-auto"
          />
        </div>
      </slot>
    </VCardText>
  </div>
</template>
