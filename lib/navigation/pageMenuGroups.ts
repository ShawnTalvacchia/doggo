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
      { label: "Profile", value: "/signup/profile" },
      { label: "Pet", value: "/signup/pet" },
      { label: "Visibility", value: "/signup/visibility" },
      { label: "Success", value: "/signup/success" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Community (All)", value: "/home" },
      { label: "Community (Parks)", value: "/home?tab=parks" },
      { label: "Community (Neighbors)", value: "/home?tab=neighbors" },
      { label: "Community (Interest)", value: "/home?tab=interest" },
      { label: "Community (Care)", value: "/home?tab=care" },
      { label: "Meets", value: "/meets" },
      { label: "Create Meet", value: "/meets/create" },
      { label: "Meet Detail", value: "/meets/meet-1" },
      { label: "Post-Meet Connect", value: "/meets/meet-6/connect" },
      { label: "Group Detail", value: "/groups/vinohrady-dogs" },
      { label: "Schedule", value: "/schedule" },
    ],
  },
  {
    title: "Care & Profile",
    items: [
      { label: "Discover (Care)", value: "/discover?tab=care" },
      { label: "Provider Profile", value: "/profile/olga-m" },
      { label: "Inbox", value: "/inbox" },
      { label: "My Care", value: "/bookings?tab=care" },
      { label: "My Services", value: "/bookings?tab=services" },
      { label: "My Profile", value: "/profile" },
    ],
  },
];
