"use server"

import { db } from "@/lib/db/client"
import { member } from "@/lib/db/schema"
import { eq } from "drizzle-orm"


export async function checkUserCompany(userId: string) {
  if (!userId) {
    return { hasCompany: false }
  }

  try {
    const userMembership = await db.query.member.findFirst({
      where: eq(member.userId, userId),
    })

    return {
      hasCompany: !!userMembership,
    }
  } catch (error) {
    console.error("Error checking company membership:", error)
    return { hasCompany: false }
  }
}

