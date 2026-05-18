"use server"

import { clearAdminSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect("/login")
}
