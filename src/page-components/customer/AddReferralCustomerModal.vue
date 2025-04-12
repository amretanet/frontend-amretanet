<script setup lang="ts">
import { stateManagement } from "@/store";
import RegisterCustomerForm from "../customer/RegisterCustomerForm.vue";
import { showActionResult } from "@/modules";

// INTERFACE
interface IEmits {
  (e: "customerAdded"): void;
}

// VARIABLE
const store = stateManagement();
const emits = defineEmits<IEmits>();
const is_showing_modal = ref(false);

// FUNCTION
const customerAdded = () => {
  showActionResult(
    undefined,
    undefined,
    "Pelanggan Telah Ditambahkan Ke Daftar Referral Anda!"
  );
  emits("customerAdded");
  is_showing_modal.value = false;
};
</script>
<template>
  <div>
    <div @click="is_showing_modal = true">
      <slot name="trigger-button">
        <VBtn size="40" prepend-icon="tabler-plus">
          <VTooltip activator="parent"> Tambah Pelanggan Referral </VTooltip>
        </VBtn>
      </slot>
    </div>
    <VDialog :model-value="is_showing_modal" max-width="500" persistent>
      <DialogCloseBtn @click="is_showing_modal = false" />
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon icon="tabler-plus" />
          </template>
          <template #title> Tambah Pelanggan Referral </template>
        </VCardItem>
        <VCardText>
          <RegisterCustomerForm
            max_height="70vh"
            :referral="store.getUser.referral"
            :id_mitra="store.isMitra ? store.getUser._id : undefined"
            @cancel-add="is_showing_modal = false"
            @customer-added="customerAdded()"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
