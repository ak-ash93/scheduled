"use client";
import { calendar } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navBarLinks } from "../../constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";

const UserNavbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between w-full h-25 shadow-2xl bg-white px-5 fixed z-50">
      <div className="flex flex-col lg:flex-row items-center ">
        <Link href={"/events"}>
          <Image src={calendar} width={80} alt="logo-image" />
        </Link>
        <h1 className="lg:text-lg text-sm font-light tracking-widest">
          SKeduled
        </h1>
      </div>
      <section className="flex items-center gap-3 xl:gap-20">
        {navBarLinks.map((link, index) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label + index}
              className={cn(
                "flex items-center gap-2 hover:border-b-2 hover:border-b-blue-600 p-3 ",
                isActive && "text-blue-600  "
              )}>
              <Image src={link.image} width={25} alt={link.label} />
              <p className={cn("text-sm font-light hidden lg:inline")}>
                {link.label}
              </p>
            </Link>
          );
        })}
      </section>
      <div className="hover:scale-95">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default UserNavbar;
