// <root>/middleware.ts
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const previousPage = req.nextUrl.pathname

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (!session) {
    return NextResponse.redirect(
      new URL(`/auth/login?p=${previousPage}`, req.url)
    )
  }
  return NextResponse.next()

  // normal auth
  // const previousPage = request.nextUrl.pathname
  // if (
  //   request.nextUrl.pathname.startsWith('/checkout/address') ||
  //   request.nextUrl.pathname.startsWith('/checkout/summary')
  // ) {
  //   const token = request.cookies.get('token')?.value || ''
  //   try {
  //     await jose.jwtVerify(
  //       token,
  //       new TextEncoder().encode(process.env.JWT_SECRET_SEED)
  //     )
  //     return NextResponse.next()
  //   } catch (error) {
  //     return NextResponse.redirect(
  //       new URL(`/auth/login?p=${previousPage}`, request.url)
  //     )
  //   }
  // }
}

export const config = {
  matcher: ['/checkout/:path*'],
}
