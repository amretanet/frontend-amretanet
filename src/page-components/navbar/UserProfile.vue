<script setup lang="ts">
import { roleFormatter } from "@/modules";
import { stateManagement } from "@/store";

// VARIABLE
const router = useRouter();
const store = stateManagement();

// FUNCTION
const logout = () => {
  store.logoutHandler();
  router.push("/login").then(() => {
    store.logoutHandler();
  });
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VIcon icon="tabler-user" />
      <VMenu activator="parent" width="350" location="bottom end" offset="14px">
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VIcon icon="tabler-user" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ store.getUser.name || "-" }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ roleFormatter(store.getUser.role).title }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />
          <VListItem>
            <VBtn block prepend-icon="tabler-user" to="/my-profile">
              Profil Saya
            </VBtn>
          </VListItem>
          <VListItem>
            <VBtn
              block
              prepend-icon="tabler-logout"
              color="error"
              @click="logout()"
            >
              Keluar
            </VBtn>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
