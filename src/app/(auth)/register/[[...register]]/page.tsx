import React from "react";
import Image from "next/image";
import { calendar } from "@/assets/index";
import { SignUp } from "@clerk/nextjs";

const RegisterPage = () => {
  return (
    <>
      <div className="flex flex-col items-center p-6 gap-8 ">
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
          <SignUp />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
