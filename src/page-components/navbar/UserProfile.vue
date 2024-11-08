<script setup lang="ts">
import { initialAbility } from "@/plugins/casl/ability";
import { useAppAbility } from "@/plugins/casl/useAppAbility";

const router = useRouter();
const ability = useAppAbility();

const logout = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("accessToken");
  router.push("/login").then(() => {
    localStorage.removeItem("userAbilities");
    ability.update(initialAbility);
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
              Nama User Login
            </VListItemTitle>
            <VListItemSubtitle> Administrator </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />
          <VListItem>
            <VBtn block prepend-icon="tabler-user"> My Profile </VBtn>
          </VListItem>
          <VListItem>
            <VBtn
              block
              prepend-icon="tabler-logout"
              color="error"
              @click="logout()"
            >
              Logout
            </VBtn>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
