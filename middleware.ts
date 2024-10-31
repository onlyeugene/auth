import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return ;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return ;
  }
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if(nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

//NOTE : we are only running creating this authConfig cos we are using Prisma and we want it to be compatible with the Edge

// import NextAuth from "next-auth";
// import authConfig from "./auth.config";
// import {
//   apiAuthPrefix,
//   authRoutes,
//   DEFAULT_LOGIN_REDIRECT,
//   publicRoutes,
// } from "./routes";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;  // Check if the user is authenticated
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);  // Check if it's an API auth route
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);  // Check if it's a public route
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);  // Check if it's an auth-related route (e.g., login, register)

//   // Skip authentication checks for API routes
//   if (isApiAuthRoute) {
//     return null;
//   }

//   // Handle unauthenticated users trying to access protected routes
//   if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
//     // Redirect unauthenticated users to login page
//     return Response.redirect(new URL('/auth/login', nextUrl));
//   }

//   // Handle authenticated users trying to access login or register pages
//   if (isLoggedIn && isAuthRoute) {
//     // Redirect authenticated users to the default page (e.g., dashboard)
//     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//   }

//   // Allow access to the route if it's public or the user is authenticated
//   return null;
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
