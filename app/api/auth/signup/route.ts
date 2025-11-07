import { type NextRequest, NextResponse } from "next/server"

const users: any[] = [{ id: "1", name: "Commander Alpha", email: "commander@spartans.mil", password: "password123" }]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
    }

    users.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
