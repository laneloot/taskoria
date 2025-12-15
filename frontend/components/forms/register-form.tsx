"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/hooks/useAuth";

export const RegisterForm = () => {
  const router = useRouter();
  const registerMutation = useRegister();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "member",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Passwords must match.");
      return;
    }

    try {
      await registerMutation.mutateAsync(form);
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Ensure the username/email are unique.");
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" required value={form.username} onChange={(event) => updateField("username", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          value={form.role}
          onChange={(event) => updateField("role", event.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password2">Confirm password</Label>
        <Input
          id="password2"
          type="password"
          required
          value={form.password2}
          onChange={(event) => updateField("password2", event.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={registerMutation.isPending} className="w-full">
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        Already have login? <Link href="/login" className="text-zinc-900 underline">Back to sign in</Link>
      </p>
    </form>
  );
};
