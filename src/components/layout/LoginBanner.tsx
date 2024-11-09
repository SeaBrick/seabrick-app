"use client";
import React from "react";
import Image from "next/image";



export function LoginBanner() {

    return(

<Image
        className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[rounded-tl-none50px] rounded-br-[50px]"
        src={`/login-bg.webp`}
        alt="banner"
        width={1920}
        height={414}
        /> 
    );
}