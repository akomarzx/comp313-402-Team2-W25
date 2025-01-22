"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Error = () => {
  <div>Error</div>;
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
};

export default Error;
