//bahoot sara part nextjs me Middleware search kiya waha se laya hu or khuch part nextauth se bhi
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// {default} matlab sari sites pe lag zaega mmiddleware
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt"; //getToken seacrh ker waha se is import ko laya hu Nextauth se
//kahai bhi token lena ho to getToken() lagao
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl; //current url kis pe hai abhi

  if (
    // ye redirect logic agar token hai to to in pages pe kyu zana hai token hai matlab signup signin or verified hai

    token &&
    (pathname.startsWith("/sign-in") || //token hai to sign kyu ker hai pehle se hi signin hai
      pathname.startsWith("/sign-up") || //token hai to signup kyu kerna hai pehle se hi signup hai
      pathname.startsWith("/verify")) //token hai to berify kyu kerna hai jab pehle se hi verified hai
  )
    return NextResponse.redirect(new URL("/home", request.url));

  // If user is NOT logged in and tries to access protected pages
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
//In pagees pe bhi laggega middleware
export const config = {
  matcher: ["sign-up", "/dashboard/:path*", "/verify/:path*"],
};
