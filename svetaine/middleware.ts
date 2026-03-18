import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdmin = pathname.startsWith('/api/admin')

  // 1. Tikriname administratoriaus teises
  if (isAdminRoute || isApiAdmin) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      if (isApiAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.redirect(new URL('/prisijungimas', request.url))
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      if (isApiAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const response = NextResponse.redirect(new URL('/prisijungimas', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}
