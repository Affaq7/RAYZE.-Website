import { Brand } from "@/components/layout/header";
import { LoginForm } from "@/components/ui/login-form";
import { configured } from "@/lib/env";
export default function Page() {
  return (
    <main id="main" className="login-page">
      <Brand />
      <p className="overline">— PRIVATE WORKSPACE</p>
      <h1>
        WELCOME
        <br />
        BACK.
      </h1>
      <p>Sign in with your authorized RAYZE account.</p>
      {!configured() && (
        <p className="notice">
          Admin sign-in is unavailable until the Supabase and Redis environment
          settings are configured.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
