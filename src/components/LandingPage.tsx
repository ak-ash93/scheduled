"use client";

import { calendar, planning } from "@/assets";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <main className="flex items-center justify-center w-screen h-screen p-6">
      <section className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] w-full max-w-7xl gap-10">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl font-extrabold tracking-wide text-gray-600">
            SKeduled
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Your next planning partner
          </p>

          <Image
            src={calendar}
            width={400}
            height={400}
            alt="Illustration of a calendar"
            className="my-6"
          />

          <h2 className="text-gray-500 tracking-wide px-6 max-w-xl">
            Join us to plan ahead, stay on top of everything, and get smart
            reminders—making your day simpler and stress-free.
          </h2>

          {/* Button Link to Sign Up */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Link
              href="/register"
              className="mt-5 py-2 px-6 bg-blue-500 text-sm text-white font-semibold rounded-full hover:bg-blue-600 transition">
              Get Started
            </Link>
            <Link
              href="/login"
              className=" py-2 px-6 bg-blue-500 text-sm text-white font-semibold rounded-full hover:bg-blue-600 transition lg:hidden">
              Already a member?
            </Link>
          </div>
        </div>

        {/* Right Side (Planning image and SignIn) */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center gap-6">
          <Image
            src={planning}
            width={500}
            height={500}
            alt="Planning illustration"
            className="pointer-events-none"
          />
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <SignIn routing="hash" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
