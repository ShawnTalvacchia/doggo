export type PageMenuGroup = {
  title: string;
  items: { label: string; value: string }[];
};

export const PAGE_MENU_GROUPS: PageMenuGroup[] = [
  {
    title: "Sign Up",
    items: [
      { label: "Start", value: "/signup/start" },
      { label: "Role", value: "/signup/role" },
      { label: "Profile", value: "/signup/profile" },
      { label: "Care Preferences", value: "/signup/care-preferences" },
      { label: "Walking", value: "/signup/walking" },
      { label: "Hosting", value: "/signup/hosting" },
      { label: "Pet", value: "/signup/pet" },
      { label: "Success", value: "/signup/success" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Results", value: "/explore/results" },
      { label: "Profile", value: "/explore/profile/olga-m" },
    ],
  },
  {
    title: "System",
    items: [{ label: "Styleguide", value: "/styleguide" }],
  },
];
