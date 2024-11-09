"use client";
import React from "react";
import ResetPasswordForm from "@/components/forms/ResetPassword";
import { LoginBanner } from "@/components/layout/LoginBanner";




export default function ResetPasswordPage() {
  return(
    <>
    <LoginBanner/>
    <div className="flex justify-center">
        <div className="flex flex-col z-10">          
          <ResetPasswordForm/>  
        </div>
    </div>
    </>
    );
}
