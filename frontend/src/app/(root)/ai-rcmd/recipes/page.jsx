"use client";

import React from "react";

import { useSearchParams } from "next/navigation";
const AIRecipies = () => {
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data") || "{}");

  return <div>{JSON.stringify(data)}</div>;
};

export default AIRecipies;
