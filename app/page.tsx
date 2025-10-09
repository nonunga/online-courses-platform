"use server";

import { auth } from "@/lib/auth";
import { LogInButton } from "./components/login-btn";
import { LogOutButton } from "./components/logout-btn";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <div>
        <h1>Welcome, {session.user.name}!</h1>
        {session.user.image && (
          <Image
            src={session.user.image}
            width={48}
            height={48}
            alt={session.user.name ?? "Avatar"}
            style={{ borderRadius: "50%" }}
          />
        )}
        <LogOutButton />
      </div>
    );
  }

  return (
    <div>
      <h1>AUTH</h1> <p>Not Signed In</p> <LogInButton />
    </div>
  );
}
