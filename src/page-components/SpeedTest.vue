<script setup lang="ts">
// VARIABLE
const current_tab = ref("open_speedtest");
</script>
<template>
  <div>
    <VTabs v-model="current_tab">
      <VTab value="open_speedtest"> Open Speedtest </VTab>
      <VTab value="fast_speedtest"> Fast Speedtest </VTab>
    </VTabs>
    <div class="mt-2">
      <VCard v-if="current_tab === 'open_speedtest'" height="530">
        <div style="text-align: right">
          <div style="height: 500px">
            <div
              style="
                width: 100%;
                height: 0;
                padding-bottom: 50%;
                position: relative;
              "
            >
              <iframe
                style="
                  border: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 530px;
                  border: none;
                  overflow: hidden !important;
                "
                src="//openspeedtest.com/speedtest"
              ></iframe>
            </div>
          </div>
        </div>
      </VCard>
      <VCard v-else height="530" color="#fff">
        <VCardText>
          <iframe
            src="https://fast.com"
            width="100%"
            height="500px"
            style="border: none"
          >
          </iframe>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
