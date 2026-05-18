import { cookies } from "next/headers"

const ADMIN_SESSION_KEY = "luxe_admin_session"

export async function setAdminSession(email: string) {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_KEY, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_KEY)
  return session ? session.value : null
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_KEY)
}
