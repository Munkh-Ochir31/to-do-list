import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./app/lib/session";

// Тактик [Limit Access / Defense-in-Depth]:
// proxy нь хүсэлт DAL-д хүрэхээс өмнө хамгаалалтын эхний шат болж ажиллана.
// Энд optimistic check хийнэ — токений HMAC-ийг шалгаж, expired эсэхийг тогтооно.
const PUBLIC_PATHS = ["/login"];

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.includes(path);

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verifyToken(token) : null;

  if (!isPublic && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isPublic && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Static asset, API route, _next дэд замуудыг хасаж байна.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
