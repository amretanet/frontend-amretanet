export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "customers-dashboard",
    access: [99],
  },
  {
    title: "Transaksi",
    icon: { icon: "tabler-credit-card-pay" },
    access: [99],
    children: [
      {
        title: "Tagihan",
        icon: { icon: "tabler-file-invoice" },
        to: "customers-transaction-billing",
        access: [99],
      },
    ],
  },
];
