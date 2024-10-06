"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function PrivatePage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push("/login");
    return;
  }

  return <p>Hello {user.email}</p>;
}
