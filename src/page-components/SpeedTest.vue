<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard height="450">
        <div style="text-align: right">
          <div style="min-height: 450px">
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
                  height: 100%;
                  min-height: 450px;
                  border: none;
                  overflow: hidden !important;
                "
                src="//openspeedtest.com/speedtest"
              ></iframe>
            </div>
          </div>
        </div>
      </VCard>
    </VCol>
    <VCol cols="12" md="4">
      <VCard height="450">
        <iframe
          src="https://fast.com"
          width="100%"
          height="450px"
          style="border: none"
        >
        </iframe>
      </VCard>
    </VCol>
  </VRow>
</template>
