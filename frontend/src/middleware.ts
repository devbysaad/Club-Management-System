import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/setting";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Build matchers from settings
const routeMatchers = Object.entries(routeAccessMap).map(
  ([route, allowedRoles]) => ({
    matcher: createRouteMatcher([route]),
    allowedRoles: allowedRoles as string[],
  })
);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // ✅ Allow public routes to pass through
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  // 🚫 Not logged in → send to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Get role correctly
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  // 🚫 Logged in but no role → block
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔐 Role-based access check
  for (const { matcher, allowedRoles } of routeMatchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

