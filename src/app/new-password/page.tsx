"use client";
import React from "react";
import NewPasswordForm from "@/components/forms/NewPassword";
import { LoginBanner } from "@/components/layout/LoginBanner";



export default function NewPasswordPage() {
  return(
    <>
    <LoginBanner/> 
    <div className="flex justify-center">        
        <div className="flex flex-col z-10">                    
          <NewPasswordForm/>
        </div>
    </div>
    </>
    );
}
