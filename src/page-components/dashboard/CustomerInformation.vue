<script setup lang="ts">
import { paymentStatusFormatter, thousandSeparator } from "@/modules";
import axiosIns from "@/plugins/axios";
import { stateManagement } from "@/store";

// VARIABLE
const store = stateManagement();
const customer_invoice = ref({
  amount: 0,
  status: null,
});
const customer_package = ref({
  name: null,
  bandwidth: 0,
});

// FUNCTION
const getCustomerInfo = () => {
  axiosIns
    .get(`customer/dashboard-info/${store.getUser.id_customer}`)
    .then((res) => {
      customer_invoice.value = res?.data?.customer_invoice;
      customer_package.value = res?.data?.customer_package;
    })
    .catch(() => {
      customer_invoice.value = {
        amount: 0,
        status: null,
      };
      customer_package.value = {
        name: null,
        bandwidth: 0,
      };
    });
};

// LIFECYCLE HOOKS
onMounted(() => {
  getCustomerInfo();
});
</script>
<template>
  <VRow>
    <VCol cols="12" md="6" sm="12">
      <VCard
        variant="flat"
        color="primary"
        class="h-100 clickable"
        to="/customers/invoice"
      >
        <VCardText>
          <div class="d-flex align-center gap-2">
            <div>
              <VAvatar variant="tonal" size="70">
                <VIcon icon="tabler-file-invoice" size="35" />
              </VAvatar>
            </div>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Tagihan Bulan Ini</div>
              <div>
                <span class="fs-30 font-weight-bold">
                  {{
                    customer_invoice.amount
                      ? "Rp" + thousandSeparator(customer_invoice.amount)
                      : "Belum Ada Tagihan"
                  }}
                </span>
                <small v-if="customer_invoice.status" class="ms-1">
                  ({{ paymentStatusFormatter(customer_invoice.status).title }})
                </small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="6" sm="12">
      <VCard variant="flat" color="success" class="h-100">
        <VCardText>
          <div class="d-flex align-center gap-2">
            <div>
              <VAvatar variant="tonal" size="70">
                <VIcon icon="tabler-wifi" size="35" />
              </VAvatar>
            </div>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Paket Internet</div>
              <div>
                <span class="fs-30 font-weight-bold">
                  {{ customer_package?.name || "Tidak Ada Paket Aktif" }}
                </span>
                <small v-if="customer_package.bandwidth" class="ms-1">
                  ({{ customer_package.bandwidth }}Mbps)
                </small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
