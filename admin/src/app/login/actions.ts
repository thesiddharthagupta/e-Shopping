"use server"

import { db } from "@/lib/db"
import { setAdminSession } from "@/lib/auth"

export async function loginAdminAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." }
  }

  try {
    // 1. Query user from database
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: "Invalid email or password." }
    }

    // 2. Validate password
    if (user.password !== password) {
      return { success: false, error: "Invalid email or password." }
    }

    // 3. Validate role
    if (user.role !== "ADMIN") {
      return { success: false, error: "Access denied. Admin credentials required." }
    }

    // 4. Create session
    await setAdminSession(user.email)

    return { success: true }
  } catch (error) {
    console.error("Login server error:", error)
    return { success: false, error: "An unexpected server error occurred." }
  }
}
