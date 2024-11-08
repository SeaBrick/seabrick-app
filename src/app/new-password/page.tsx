"use client";
import React from "react";
import Image from "next/image";
import NewPasswordForm from "@/components/forms/NewPassword";


export default function NewPasswordPage() {
  return( 
    <div className="w-full h-[80vh] md:h-screen relative bg-[#f6f6f6] flex justify-center">
        <Image
          className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[50px] rounded-br-[50px]"
          src={`/login-bg.webp`}
          alt="banner"
          width={1920}
          height={414}
        />
        <div className="flex flex-col z-10">        
                    
          <NewPasswordForm/>
        </div>
    </div>
    );
}
