"use client";
import { login, logout } from "@/lib/actions/auth";

export const LogOutButton = () => {
  return <button onClick={() => logout()}>Sign Out</button>;
};
