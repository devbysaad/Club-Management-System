import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/setting";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  "/",
  "/about",
  "/admission",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  console.log("🔵 MIDDLEWARE RUNNING:", pathname);

  // Allow public routes to pass through
  if (publicRoutes(req)) {
    console.log("✅ Public route, allowing:", pathname);
    return NextResponse.next();
  }

  const { userId } = await auth();
  console.log("👤 UserId:", userId);

  // Not logged in → send to sign-in
  if (!userId) {
    console.log("❌ No userId - redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // User is authenticated - allow access
  // Role-based routing is handled client-side in the sign-in page
  console.log("✅ User authenticated - allowing access to:", pathname);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

