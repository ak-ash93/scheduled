import { event, publicProfile, scheduleImg } from "@/assets";

const navBarLinks = [
  {
    route: "/events",
    label: "Events",
    image: event,
  },
  {
    route: "/schedule",
    label: "Schedule",
    image: scheduleImg,
  },
  {
    route: "/book",
    label: "Public Profile",
    image: publicProfile,
  },
];

export { navBarLinks };
