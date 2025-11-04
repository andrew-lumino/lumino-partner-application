import { auth, clerkClient } from "@clerk/nextjs/server"

export async function getUserInfo() {
  const { userId } = auth()

  if (!userId) return null

  const user = await clerkClient.users.getUser(userId)
  return user
}
