import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/setting";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  "/",
  "/about",
  "/admission",
  "/shop",           // ✅ SHOP IS PUBLIC
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Protected routes that require authentication
const protectedRoutes = createRouteMatcher([
  "/admin(.*)",
  "/teacher(.*)",
  "/student(.*)",
  "/parent(.*)",
  "/list/(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  console.log("🔵 MIDDLEWARE RUNNING:", pathname);

  // Allow public routes to pass through
  if (publicRoutes(req)) {
    console.log("✅ Public route, allowing:", pathname);
    return NextResponse.next();
  }

  // Check if route requires authentication
  if (protectedRoutes(req)) {
    const { userId } = await auth();
    console.log("👤 UserId:", userId);

    // Not logged in → send to home
    if (!userId) {
      console.log("❌ No userId - redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // User is authenticated - allow access
    console.log("✅ User authenticated - allowing access to:", pathname);
    return NextResponse.next();
  }

  // All other routes are allowed
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

