<script setup lang="ts">
// VARIABLE
const faq_data = ref([
  {
    title: "⁠Apa itu AMRETA NET?",
    descripton:
      "AMRETA NET adalah layanan telekomunikasi yang menyediakan berbagai layanan Internet.",
  },
  {
    title: "⁠Bagaimana cara mendaftar untuk menggunakan layanan AMRETA NET?",
    descripton:
      "Anda dapat mendaftar melalui situs web AMRETA NET atau menghubungi layanan pelanggan mereka untuk informasi lebih lanjut.",
  },
  {
    title: "Apa yang termasuk dalam paket layanan AMRETA NET?",
    descripton:
      "Paket layanan AMRETA NET mencakup internet dengan kecepatan tertentu seperti 10 Mbps, 20 Mbps dll.",
  },
  {
    title: "Apakah ada biaya tambahan untuk layanan AMRETA NET?",
    descripton:
      "Tidak ada biaya tambahan, kecuali untuk layanan tambahan yang mungkin Anda minta seperti peningkatan kecepatan internet atau layanan khusus lainnya.",
  },
  {
    title: "Bagaimana cara menghubungi layanan pelanggan AMRETA NET?",
    descripton:
      "Anda dapat menghubungi layanan pelanggan AMRETA NET melalui nomor telepon yang tersedia di situs web mereka atau mengirim email ke alamat yang tertera di situs web.",
  },
  {
    title: "Apakah ada syarat dan ketentuan yang harus diikuti?",
    descripton:
      "Ya, ada syarat dan ketentuan yang harus diikuti saat menggunakan layanan AMRETA NET. Anda dapat menemukan informasi lebih lanjut di bagian syarat dan ketentuan pada situs web.",
  },
  {
    title: "⁠Bagaimana cara melakukan pembayaran melalui iPaymu?",
    descripton:
      "Untuk melakukan pembayaran melalui iPaymu, ikuti langkah-langkah berikut: </br> 1. Masuk ke akun Anda di situs AMRETA NET. </br> 2. Pilih opsi 'Pembayaran Otomatis' sebagai metode pembayaran. </br> 3. Masukkan informasi yang diminta dan ikuti instruksi untuk menyelesaikan pembayaran.",
  },
  {
    title: "Apakah ada biaya tambahan untuk pembayaran menggunakan iPaymu?",
    descripton:
      "Tidak ada biaya tambahan untuk menggunakan iPaymu sebagai metode pembayaran. Namun, pastikan untuk memeriksa kebijakan iPaymu untuk memastikan tidak ada biaya tersembunyi.",
  },
  {
    title:
      "Berapa lama waktu yang dibutuhkan untuk pembayaran melalui iPaymu diproses?",
    descripton:
      "Pembayaran melalui iPaymu biasanya diproses secara instan. Setelah pembayaran berhasil, saldo akun Anda akan diperbarui secara otomatis.",
  },
  {
    title: "⁠Apakah pembayaran melalui iPaymu aman?",
    descripton:
      "Ya, pembayaran melalui iPaymu aman. iPaymu menggunakan teknologi enkripsi canggih untuk melindungi informasi Anda dan memastikan transaksi Anda tetap aman.",
  },
  {
    title: "Apa yang harus saya lakukan jika pembayaran melalui iPaymu gagal?",
    descripton:
      "Jika pembayaran melalui iPaymu gagal, Anda dapat mencoba metode pembayaran lain atau menghubungi layanan pelanggan AMRETA NET untuk bantuan lebih lanjut.",
  },
]);
</script>
<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-align-box-left-stretch" />
      </template>
      <template #title> FAQ </template>
    </VCardItem>
    <VCardText class="d-flex flex-column gap-2">
      <VExpansionPanels v-for="item in faq_data" variant="inset">
        <VExpansionPanel :title="item.title" class="border rounded-lg">
          <template #text>
            <div v-html="item.descripton"></div>
          </template>
        </VExpansionPanel>
      </VExpansionPanels>
    </VCardText>
  </VCard>
</template>
