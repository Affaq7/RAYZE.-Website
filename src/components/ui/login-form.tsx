"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <form
      className="submission-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              Object.fromEntries(new FormData(e.currentTarget)),
            ),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          router.push("/admin");
          router.refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Unable to sign in.");
          setPending(false);
        }
      }}
    >
      <label>
        Email
        <input type="email" name="email" required autoComplete="username" />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </label>
      <button className="button" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p role="alert">{error}</p>
    </form>
  );
}
export function Logout() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <>
      <button
        onClick={async () => {
          try {
            const r = await fetch("/api/auth/logout", { method: "POST" });
            if (!r.ok) throw Error();
            router.push("/admin/login");
            router.refresh();
          } catch {
            setError("Unable to sign out. Try again.");
          }
        }}
      >
        Sign out
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
