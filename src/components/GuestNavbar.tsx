import { calendar } from "@/assets";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const GuestNavbar = () => {
  return (
    <nav className="flex justify-between  items-center fixed z-50 w-full h-25 bg-white shadow-2xl px-8">
      <div className="flex items-center gap-80 ">
        <Link href="/login" className="px-2 ">
          <Image src={calendar} width={80} alt="logo-image" />
        </Link>
        <h1 className="hidden xl:inline-block text-center text-2xl font-bold tracking-widest text-gray-600">
          SKeduled-The Modern Scheduling Platform
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-5">
        <SignInButton>
          <Button
            variant={"secondary"}
            size={"md"}
            className="bg-blue-400 text-white">
            Login
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button size={"md"} variant={"outline"}>
            Register
          </Button>
        </SignUpButton>
      </div>
    </nav>
  );
};

export default GuestNavbar;
