<template>
  <VBtn icon variant="text" color="default" size="small">
    <VBadge color="warning" content="4">
      <VIcon icon="tabler-bell" size="24" />
    </VBadge>

    <VMenu activator="parent" width="380px" offset="14px">
      <VList class="py-0">
        <VListItem
          title="Notifications"
          class="notification-section"
          height="48px"
        >
          <template #append>
            <VChip color="primary" size="small"> 30 New </VChip>
          </template>
        </VListItem>
        <VDivider />
        <template v-for="item in 3">
          <VListItem link lines="one" min-height="66px">
            <template #title> Notifikasi ke {{ item }} </template>
            <template #subtitle> Ini adalah notifikasi ke {{ item }} </template>
            <template #prepend>
              <VListItemAction start>
                <VAvatar :color="'primary'" size="40" variant="tonal">
                  <span> x </span>
                </VAvatar>
              </VListItemAction>
            </template>
            <template #append>
              <small class="whitespace-no-wrap text-medium-emphasis">
                9 Jam Lalu
              </small>
            </template>
          </VListItem>
          <VDivider />
        </template>
        <VListItem class="notification-section">
          <VBtn block @click="$emit('click:readAllNotifications')">
            READ ALL NOTIFICATIONS
          </VBtn>
        </VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
