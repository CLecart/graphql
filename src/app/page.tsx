"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p>Redirecting...</p>
    </div>
  );
}
