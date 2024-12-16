<template>
  <VRow>
    <VCol cols="12" md="3" sm="12">
      <VCard variant="tonal" color="primary">
        <VCardText>
          <div class="d-flex align-center gap-2">
            <VAvatar variant="tonal" color="primary" size="70">
              <VIcon icon="tabler-ticket" size="35" />
            </VAvatar>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Tiket Open</div>
              <div>
                <span class="fs-30 font-weight-bold">29</span>
                <small class="ms-1">(Tiket)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3" sm="12">
      <VCard variant="tonal" color="dark">
        <VCardText>
          <div class="d-flex align-center gap-2">
            <VAvatar variant="tonal" color="dark" size="70">
              <VIcon icon="tabler-hourglass" size="35" />
            </VAvatar>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Tiket Pending</div>
              <div>
                <span class="fs-30 font-weight-bold">4</span>
                <small class="ms-1">(Tiket)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3" sm="12">
      <VCard variant="tonal" color="success">
        <VCardText>
          <div class="d-flex align-center gap-2">
            <VAvatar variant="tonal" color="success" size="70">
              <VIcon icon="tabler-clock-check" size="35" />
            </VAvatar>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Tiket Close</div>
              <div>
                <span class="fs-30 font-weight-bold">4</span>
                <small class="ms-1">(Tiket)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3" sm="12">
      <VCard variant="tonal" color="warning">
        <VCardText>
          <div class="d-flex align-center gap-2">
            <VAvatar variant="tonal" color="warning" size="70">
              <VIcon icon="tabler-refresh-dot" size="35" />
            </VAvatar>
            <div class="d-flex flex-column gap-4">
              <div class="fs-16">Tiket On Progress</div>
              <div>
                <span class="fs-30 font-weight-bold">4</span>
                <small class="ms-1">(Tiket)</small>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
