import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { updateSession } from './utils/supabase/middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Atnaujinti Supabase sesiją (Slapukus)
  let response = await updateSession(request);

  // 2. Administracinių maršrutų apsauga (Custom JWT)
  const isApiAdmin = pathname.startsWith('/api/admin') || (pathname === '/api/properties' && request.method === 'POST');
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage || isApiAdmin) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isApiAdmin) {
        return NextResponse.json({ error: 'Autorizacija privaloma' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/prisijungimas', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
    } catch (error) {
      if (isApiAdmin) {
        return NextResponse.json({ error: 'Neteisingas autorizacijos raktas' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/prisijungimas', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/properties'],
};
