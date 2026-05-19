export type PageMenuGroup = {
  title: string;
  items: { label: string; value: string }[];
};

export const PAGE_MENU_GROUPS: PageMenuGroup[] = [
  {
    title: "System",
    items: [
      { label: "Landing", value: "/" },
      { label: "Sign In", value: "/signin" },
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
      { label: "Community Feed", value: "/home" },
      { label: "Group Detail", value: "/communities/group-1" },
      { label: "Create Group", value: "/communities/create" },
      { label: "Meet Detail", value: "/meets/meet-1" },
      { label: "Post-Meet Review", value: "/meets/meet-9/connect" },
      { label: "Create Meet", value: "/meets/create" },
    ],
  },
  {
    title: "Discover & Care",
    items: [
      { label: "Discover Hub", value: "/discover" },
      { label: "Discover Meets", value: "/discover/meets" },
      { label: "Discover Groups", value: "/discover/groups" },
      { label: "Discover Care", value: "/discover/care" },
    ],
  },
  {
    title: "Schedule & Bookings",
    items: [
      { label: "My Schedule", value: "/schedule" },
      { label: "Bookings", value: "/bookings" },
      { label: "Booking Detail", value: "/bookings/booking-klara-hana" },
      { label: "Checkout", value: "/bookings/booking-olga-walks/checkout" },
    ],
  },
  {
    title: "Messaging",
    items: [
      { label: "Inbox", value: "/inbox" },
      { label: "Thread", value: "/inbox/olga-conv" },
      { label: "Notifications", value: "/notifications" },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "My Profile", value: "/profile" },
      { label: "User Profile — Tereza", value: "/profile/tereza" },
      { label: "User Profile — Klára (provider)", value: "/profile/klara" },
      { label: "Share Link", value: "/connect/shawn-demo" },
    ],
  },
];
