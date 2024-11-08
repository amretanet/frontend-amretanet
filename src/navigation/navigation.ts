export default [
  {
    title: "Dashboard",
    icon: { icon: "tabler-dashboard" },
    to: "dashboard",
  },
  {
    title: "Settings",
    icon: { icon: "tabler-settings-cog" },
    children: [
      {
        title: "User",
        icon: { icon: "tabler-users" },
        to: "settings-user",
      },
    ],
  },
];
