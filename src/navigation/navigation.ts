export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "managements-dashboard",
    access: [1],
  },
  {
    title: "Master Data",
    icon: { icon: "tabler-server-cog" },
    access: [1],
    children: [
      {
        title: "Invoice",
        icon: { icon: "tabler-file-dollar" },
        to: "managements-master-data-invoice",
        access: [1],
      },
      {
        title: "Pelanggan",
        icon: { icon: "tabler-user-square-rounded" },
        to: "managements-master-data-customer",
        access: [1],
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: { icon: "tabler-settings-cog" },
    access: [1],
    children: [
      {
        title: "Konfigurasi Sistem",
        icon: { icon: "tabler-device-desktop-cog" },
        to: "managements-settings-system-configuration",
        access: [1],
      },
      {
        title: "Perangkat",
        icon: { icon: "tabler-router" },
        to: "managements-settings-hardware",
        access: [1],
      },
      {
        title: "Pengguna",
        icon: { icon: "tabler-users" },
        to: "managements-settings-user",
        access: [1],
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
