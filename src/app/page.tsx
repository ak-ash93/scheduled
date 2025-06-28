import LandingPage from "@/components/LandingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) return <LandingPage />;
  return redirect("/dashboard");
};

export default HomePage;
