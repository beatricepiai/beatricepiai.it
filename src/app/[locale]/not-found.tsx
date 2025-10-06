"use client";

import Error from "next/error";

export default async function NotFound() {
  return <Error statusCode={404} />;
}
