<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-building-skyscraper" />
      </template>
      <template #title> Data Profil Perusahaan </template>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <div class="text-center">
            <img src="/logo.png" alt="Logo" style="width: 50%;" />
            <div class="mt-2">
              <VBtn size="small" prepend-icon="tabler-edit"> Ubah Logo </VBtn>
            </div>
          </div>
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField label="Nama Perusahaan" />
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField label="Nama Alias Perusahaan" />
              </VCol>
              <VCol cols="12" md="6" sm="12">
                <VTextField label="Nama Pemilik" />
              </VCol>
            </VRow>
          </VCardText>
        </VCol>
        <VCol cols="12" md="6" sm="12">
          <VCardText>
            <div>SEBELAH KANAN</div>
          </VCardText>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
