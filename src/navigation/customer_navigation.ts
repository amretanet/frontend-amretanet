export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "customers-dashboard",
    access: [99],
  },
  {
    title: "Pelanggan Referral",
    icon: { icon: "tabler-user-square-rounded" },
    to: "referral-customer",
    access: [99],
  },
  {
    title: "Tagihan",
    icon: { icon: "tabler-file-invoice" },
    access: [99],
    to: "customers-invoice",
  },
  {
    title: "Layanan",
    icon: { icon: "tabler-adjustments-horizontal" },
    access: [99],
    children: [
      {
        title: "Tiket Pengaduan",
        icon: { icon: "tabler-message-chatbot" },
        to: "customers-service-complaint",
        access: [99],
      },
      {
        title: "Pengajuan Perubahan",
        icon: { icon: "tabler-recycle" },
        to: "customers-service-submission",
        access: [99],
      },
    ],
  },
];
