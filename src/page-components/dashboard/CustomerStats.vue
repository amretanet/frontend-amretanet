<script setup lang="ts">
import { thousandSeparator } from "@/modules";
</script>

<template>
  <VRow>
    <VCol cols="12" md="6" sm="12">
      <VCard>
        <VCardText>
          <div class="d-flex gap-3 align-center">
            <VAvatar color="primary" size="90" variant="tonal">
              <VIcon icon="tabler-file-invoice" size="60" />
            </VAvatar>
            <div class="d-flex flex-column gap-2">
              <div class="fs-20 font-weight-black">Tagihan Saya</div>
              <div class="font-weight-bold fs-20 mt-2">
                Rp{{ thousandSeparator(154000) }}
                <span class="fs-14 font-weight-bold">(BELUM DIBAYAR)</span>
              </div>
              <div class="fs-14">Periode 03 Desember 2024</div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="6" sm="12">
      <VCard>
        <VCardText>
          <div class="d-flex gap-3 align-center">
            <VAvatar color="success" size="90" variant="tonal">
              <VIcon icon="tabler-wifi" size="60" />
            </VAvatar>
            <div class="d-flex flex-column gap-2">
              <div class="fs-20 font-weight-black">Paket Internet</div>
              <div class="font-weight-bold fs-20 mt-2">10MBps</div>
              <div class="fs-14">Amreta-2021</div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
