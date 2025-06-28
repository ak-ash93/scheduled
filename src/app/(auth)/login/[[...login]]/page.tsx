"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { calendar } from "@/assets/index";
import { SignIn } from "@clerk/nextjs";
import gsap from "gsap";

const LoginPage = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);
  return (
    <>
      <main ref={mainRef} className="flex flex-col items-center p-6 gap-8 ">
        <h1 className="text-3xl xl:mt-20 font-extrabold text-gray-600 tracking-wider">
          Skeduled
        </h1>
        <Image
          src={calendar}
          width={200}
          height={200}
          alt="scheduled logo image"
        />
        <div className="mt-5">
          <SignIn />
        </div>
      </main>
    </>
  );
};

export default LoginPage;
