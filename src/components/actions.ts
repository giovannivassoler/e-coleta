import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { member } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ hasCompany: false })
  }

  try {
    // Check if the user is a member of any organization
    const userMembership = await db.query.member.findFirst({
      where: eq(member.userId, userId),
    })

    return NextResponse.json({
      hasCompany: !!userMembership,
    })
  } catch (error) {
    console.error("Error checking company membership:", error)
    return NextResponse.json({ hasCompany: false }, { status: 500 })
  }
}

