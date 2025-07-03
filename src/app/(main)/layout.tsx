import GuestNavbar from "@/components/GuestNavbar";
import UserNavbar from "@/components/UserNavbar";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  return (
    <main className="relative">
      {user ? <UserNavbar /> : <GuestNavbar />}

      <section>{children}</section>
    </main>
  );
};

export default MainLayout;
