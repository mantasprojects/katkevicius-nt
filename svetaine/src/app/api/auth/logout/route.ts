import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 })
  
  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL("/prisijungimas", req.url))
  
  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}
