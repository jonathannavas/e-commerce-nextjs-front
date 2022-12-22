// <root>/middleware.ts
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import * as jose from 'jose'

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const previousPage = request.nextUrl.pathname
  if (
    request.nextUrl.pathname.startsWith('/checkout/address') ||
    request.nextUrl.pathname.startsWith('/checkout/summary')
  ) {
    const token = request.cookies.get('token')?.value || ''
    try {
      await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_SEED)
      )
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${previousPage}`, request.url)
      )
    }
  }
}

export const config = {
  matcher: ['/checkout/:path*'],
}
