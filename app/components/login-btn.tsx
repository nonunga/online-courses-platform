"use client";
import { login } from "@/lib/actions/auth";

export const LogInButton = () => {
  return <button onClick={() => login()}>Sign In With Github</button>;
};
