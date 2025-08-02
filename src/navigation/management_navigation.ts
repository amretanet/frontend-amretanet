export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "managements-dashboard",
    access: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    title: "Pelanggan",
    icon: { icon: "tabler-user-square-rounded" },
    to: "managements-customer",
    access: [0, 1, 3, 4],
  },
  {
    title: "Mitra",
    icon: { icon: "mdi-handshake-outline" },
    to: "managements-mitra",
    access: [0, 1],
  },
  {
    title: "Bonus Referral",
    icon: { icon: "tabler-wallet" },
    to: "managements-referral-fee",
    access: [6],
  },
  {
    title: "Pelanggan Referral",
    icon: { icon: "tabler-user-square-rounded" },
    to: "referral-customer",
    access: [2, 5, 6],
  },
  {
    title: "Bill-Collector",
    icon: { icon: "tabler-cash-register" },
    access: [0, 1, 3, 4, 7],
    children: [
      {
        title: "Bill Collector",
        to: "managements-bill-collector-user",
        icon: { icon: "tabler-report-money" },
        access: [0, 1, 3, 7],
      },
      {
        title: "Pelanggan Bill-Collector",
        icon: { icon: "mdi-clipboard-user" },
        to: "managements-bill-collector-pelanggan",
        access: [0, 1, 3, 7],
      },
      {
        title: "Assigned Bill-Collector",
        icon: { icon: "mdi-clipboard-user" },
        to: "managements-bill-collector-assigned",
        access: [0, 1, 3, 7],
      },
    ],
  },
  {
    title: "Keuangan",
    icon: { icon: "tabler-cash-register" },
    access: [0, 1, 3, 4, 7],
    children: [
      {
        title: "Tagihan Pelanggan",
        icon: { icon: "tabler-file-invoice" },
        to: "managements-finance-invoice",
        access: [0, 1, 3, 4],
      },
      {
        title: "Pemasukan",
        icon: { icon: "mdi-bank-transfer-in" },
        to: "managements-finance-income",
        access: [0, 1, 3],
      },
      {
        title: "Pengeluaran",
        icon: { icon: "mdi-bank-transfer-out" },
        to: "managements-finance-expenditure",
        access: [0, 1, 3],
      },
      {
        title: "Gaji Karyawan",
        icon: { icon: "mdi-account-cash-outline" },
        to: "managements-finance-salary",
        access: [0, 1, 3],
      },
      {
        title: "Rekapitulasi",
        icon: { icon: "tabler-vocabulary" },
        to: "managements-finance-cashflow",
        access: [0, 1, 3],
      },
    ],
  },
  {
    title: "Mikrotik",
    icon: { icon: "tabler-router" },
    access: [0, 1, 4],
    children: [
      {
        title: "Interface",
        icon: { icon: "mdi-expansion-card-variant" },
        to: "managements-mikrotik-interface",
        access: [0, 1, 4],
      },
      {
        title: "Log",
        icon: { icon: "mdi-history" },
        to: "managements-mikrotik-log",
        access: [0, 1, 4],
      },
      {
        title: "Profile",
        icon: { icon: "tabler-list-details" },
        to: "managements-mikrotik-profile",
        access: [0, 1, 4],
      },
      {
        title: "Secret",
        icon: { icon: "tabler-circle-key" },
        to: "managements-mikrotik-secret",
        access: [0, 1, 4],
      },
    ],
  },
  {
    title: "Layanan",
    icon: { icon: "tabler-adjustments-horizontal" },
    access: [0, 1, 2, 3, 4, 5],
    children: [
      {
        title: "Pesan Whatsapp",
        icon: { icon: "tabler-brand-whatsapp" },
        to: "managements-service-whatsapp-message",
        access: [0, 1, 3, 4],
      },
      {
        title: "Paket",
        icon: { icon: "tabler-box" },
        to: "managements-service-package",
        access: [0, 1, 3, 4],
      },
      {
        title: "Tiket",
        icon: { icon: "tabler-ticket" },
        to: "managements-service-ticket",
        access: [0, 1, 2, 3, 4, 5],
      },
      {
        title: "Pengajuan Perubahan",
        icon: { icon: "tabler-recycle" },
        to: "customers-service-change-submission",
        access: [0, 1, 3],
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: { icon: "tabler-settings-cog" },
    access: [0, 1, 4],
    children: [
      {
        title: "Cakupan Area",
        icon: { icon: "tabler-map-star" },
        to: "managements-settings-coverage-area",
        access: [0, 1, 4],
      },
      {
        title: "Perangkat",
        icon: { icon: "tabler-access-point" },
        to: "managements-settings-hardware",
        access: [0, 1, 4],
      },
      {
        title: "Pengguna",
        icon: { icon: "tabler-users" },
        to: "managements-settings-user",
        access: [0, 1, 2],
      },
    ],
  },
  {
    title: "Informasi",
    icon: { icon: "tabler-info-circle" },
    to: "managements-information",
    access: [0, 1],
  },
];
