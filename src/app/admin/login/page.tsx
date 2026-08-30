"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="serif text-4xl">Admin</h1>
      <p className="mt-2 text-sm text-paper/60">JA fashions back office</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input name="password" type="password" placeholder="Password" className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-3" required />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-paper py-3 text-sm font-medium text-ink">
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
