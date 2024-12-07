<script lang="ts" setup>
import PageHeader from "@/page-components/PageHeader.vue";
import WhatsappMessageScheduler from "@/page-components/service/whatsapp-broadcast/WhatsappMessageScheduler.vue";
import SendWhatsappMessage from "@/page-components/service/whatsapp-broadcast/SendWhatsappMessage.vue";
import WhatsappMessageTemplate from "@/page-components/service/whatsapp-broadcast/WhatsappMessageTemplate.vue";

const path_data = ref([
  {
    icon: "tabler-adjustments-horizontal",
    name: "Layanan",
  },
  {
    name: "Pesan Whatsapp",
  },
]);
const current_tab = ref("send-message");
</script>

<template>
  <VRow>
    <VCol cols="12" class="py-0">
      <PageHeader :data="path_data">
        <template #extend-header>
          <VTabs v-model="current_tab">
            <VTab value="send-message">Kirim Pesan</VTab>
            <VTab value="message-scheduler">Pesan Terjadwal</VTab>
            <VTab value="message-template">Template Pesan</VTab>
          </VTabs>
        </template>
      </PageHeader>
    </VCol>
    <VCol cols="12">
      <VWindow v-model="current_tab">
        <VWindowItem value="send-message">
          <SendWhatsappMessage />
        </VWindowItem>
        <VWindowItem value="message-scheduler">
          <WhatsappMessageScheduler />
        </VWindowItem>
        <VWindowItem value="message-template">
          <WhatsappMessageTemplate />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  title: Pesan Whatsapp
</route>
