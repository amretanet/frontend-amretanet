export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "dashboard",
  },
  // {
  //   title: "Keuangan",
  //   icon: { icon: "tabler-cash" },
  //   children: [
  //     {
  //       title: "Konfigurasi Sistem",
  //       icon: { icon: "tabler-users" },
  //       to: "settings-user",
  //     },
  //     {
  //       title: "Profil Perusahaan",
  //       icon: { icon: "tabler-users" },
  //       to: "settings-user",
  //     },
  //     {
  //       title: "Pengguna",
  //       icon: { icon: "tabler-users" },
  //       to: "settings-user",
  //     },
  //   ],
  // },
  {
    title: "Master Data",
    icon: { icon: "tabler-server-cog" },
    children: [
      {
        title: "Invoice",
        icon: { icon: "tabler-file-dollar" },
        to: "master-data-invoice",
      },
      {
        title: "Pelanggan",
        icon: { icon: "tabler-user-square-rounded" },
        to: "master-data-customer",
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: { icon: "tabler-settings-cog" },
    children: [
      {
        title: "Konfigurasi Sistem",
        icon: { icon: "tabler-device-desktop-cog" },
        to: "settings-system-configuration",
      },
      {
        title: "Profil Perusahaan",
        icon: { icon: "tabler-building-skyscraper" },
        to: "settings-company-profile",
      },
      {
        title: "Pengguna",
        icon: { icon: "tabler-users" },
        to: "settings-user",
      },
    ],
  },
  {
    title: "Informasi",
    icon: { icon: "tabler-info-circle" },
    to: "information",
  },
];
