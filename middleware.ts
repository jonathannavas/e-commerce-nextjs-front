// <root>/middleware.ts
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const previousPage = req.nextUrl.pathname

  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (!session) {
    return NextResponse.redirect(
      new URL(`/auth/login?p=${previousPage}`, req.url)
    )
  }

  const validRoles = ['admin', 'super-user', 'seo']

  if (!validRoles.includes(session.user.role)) {
    return NextResponse.redirect(new URL(`/`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
}
