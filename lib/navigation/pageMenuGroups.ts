export type PageMenuGroup = {
  title: string;
  items: { label: string; value: string }[];
};

export const PAGE_MENU_GROUPS: PageMenuGroup[] = [
  {
    title: "System",
    items: [
      { label: "Landing", value: "/" },
      { label: "Styleguide", value: "/styleguide" },
    ],
  },
  {
    title: "Sign Up",
    items: [
      { label: "Start", value: "/signup/start" },
      { label: "Role", value: "/signup/role" },
      { label: "Profile", value: "/signup/profile" },
      { label: "Pet", value: "/signup/pet" },
      { label: "Visibility", value: "/signup/visibility" },
      { label: "Success", value: "/signup/success" },
    ],
  },
  {
    title: "App",
    items: [
      { label: "Home", value: "/home" },
      { label: "Meets", value: "/meets" },
      { label: "Create Meet", value: "/meets/create" },
      { label: "Meet Detail", value: "/meets/meet-1" },
      { label: "Post-Meet Connect", value: "/meets/meet-6/connect" },
      { label: "Schedule", value: "/schedule" },
      { label: "Inbox", value: "/inbox" },
      { label: "Bookings", value: "/bookings" },
      { label: "Profile", value: "/profile" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Results", value: "/explore/results" },
      { label: "Provider Profile", value: "/explore/profile/olga-m" },
    ],
  },
];
