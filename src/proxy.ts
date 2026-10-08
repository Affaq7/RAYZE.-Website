import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://formspree.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://formspree.io; object-src 'none'`;
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  let response = NextResponse.next({ request: { headers } });
  let authorized = false;
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookieOptions: {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(items) {
            items.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request: { headers } });
            items.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    const {data,error}=await client.auth.getUser();
    authorized=!error&&Boolean(data.user&&(process.env.ADMIN_USER_IDS||'').split(',').map(id=>id.trim()).filter(Boolean).includes(data.user.id));
  }
  if(request.nextUrl.pathname.startsWith('/admin')&&request.nextUrl.pathname!=='/admin/login'&&!authorized){
    const redirect=NextResponse.redirect(new URL('/admin/login',request.url));
    response.cookies.getAll().forEach(cookie=>redirect.cookies.set(cookie));
    response=redirect;
  }
  response.headers.set("Content-Security-Policy", csp);
  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api")
  )
    response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos/|fonts/).*)"],
};
