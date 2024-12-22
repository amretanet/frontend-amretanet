export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "managements-dashboard",
    access: [1, 2, 5],
  },
  {
    title: "Pelanggan",
    icon: { icon: "tabler-user-square-rounded" },
    to: "managements-customer",
    access: [1, 2],
  },
  {
    title: "Keuangan",
    icon: { icon: "tabler-coins" },
    access: [1],
    children: [
      {
        title: "Tagihan",
        icon: { icon: "tabler-file-invoice" },
        to: "managements-finance-invoice",
        access: [1],
      },
      {
        title: "Pemasukan",
        icon: { icon: "mdi-invoice-text-arrow-left-outline" },
        to: "managements-finance-income",
        access: [1],
      },
      {
        title: "Pengeluaran",
        icon: { icon: "mdi-invoice-text-arrow-right-outline" },
        to: "managements-finance-expenditure",
        access: [1],
      },
    ],
  },
  {
    title: "Layanan",
    icon: { icon: "tabler-adjustments-horizontal" },
    access: [1, 5],
    children: [
      {
        title: "Pesan Whatsapp",
        icon: { icon: "tabler-brand-whatsapp" },
        to: "managements-service-whatsapp-message",
        access: [1],
      },
      {
        title: "Paket",
        icon: { icon: "tabler-box" },
        to: "managements-service-package",
        access: [1],
      },
      {
        title: "Tiket",
        icon: { icon: "tabler-ticket" },
        to: "managements-service-ticket",
        access: [1, 5],
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: { icon: "tabler-settings-cog" },
    access: [1, 2],
    children: [
      {
        title: "Konfigurasi Sistem",
        icon: { icon: "tabler-device-desktop-cog" },
        to: "managements-settings-system-configuration",
        access: [1],
      },
      {
        title: "Cakupan Area",
        icon: { icon: "tabler-map-star" },
        to: "managements-settings-coverage-area",
        access: [1],
      },
      {
        title: "Perangkat",
        icon: { icon: "tabler-access-point" },
        to: "managements-settings-hardware",
        access: [1],
      },
      {
        title: "Pengguna",
        icon: { icon: "tabler-users" },
        to: "managements-settings-user",
        access: [1, 2],
      },
    ],
  },
  {
    title: "Informasi",
    icon: { icon: "tabler-info-circle" },
    to: "managements-information",
    access: [1],
  },
];
