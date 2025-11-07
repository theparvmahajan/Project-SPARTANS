import { type NextRequest, NextResponse } from "next/server"

const mockUsers = [{ id: "1", name: "Commander Alpha", email: "commander@spartans.mil", password: "password123" }]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
