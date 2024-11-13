import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getUserRole } from "../utils/auth";

// FIXME: FIx logic for validation patters. Refactor

const publicPaths = ["/login", "/register", "/reset-password", "/auth", "/api"];
const loggedDisallowedPaths = [
  "/login",
  "/register",
  "/reset-password",
  "/auth",
];
const onlyAdminPaths = ["/admin", "/admin-list"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    user &&
    (request.nextUrl.pathname == "/auth/reset" ||
      request.nextUrl.pathname == "/auth/confirm")
  ) {
    return supabaseResponse;
  }

  // Check if the current path is in the list of public paths
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users to the login page if they're trying to access a protected path
  if (!user && (request.nextUrl.pathname == "/auth/reset" || !isPublicPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check if the current path is in disallowed when an user is logged
  const isLoggedDisallowed = loggedDisallowedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect  authenticated users to the home page if they're trying to access a authentication path
  if (user && isLoggedDisallowed) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check if the current path is only for admins
  const isOnlyAdmin = onlyAdminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const userRole = await getUserRole(supabase);

  // Redirect unauthorized users to the home page if they're trying to access an only admin path
  if (!userRole && isOnlyAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
