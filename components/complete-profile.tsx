"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate phone format (CR country code)
    const phoneWithCountryCode = phone.startsWith("+506")
      ? phone
      : `+506${phone}`;

    if (phoneWithCountryCode.length !== 12) {
      // +506 + 8 digits
      setError("Please enter a valid Costa Rican phone number (8 digits)");
      setLoading(false);
      return;
    }

    // Update user metadata and phone
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: name, phone_number: phoneWithCountryCode },
    });

    if (updateError) {
      setLoading(false);
      setError(updateError.message);
      return;
    }

    await supabase.auth.refreshSession();

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Account</CardTitle>
          <CardDescription>
            Please provide your full name and phone number to finish setting up
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground">
                    +506
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="12345678"
                    required
                    maxLength={8}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                  Account completed successfully!
                </div>
              )}

              {!success && (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Continue"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
