import { auth } from "@/lib/auth"
import { getBoardPost } from "@/lib/board"

import { Board } from "@/app/components/board"

export default async function Home() {
  const session = await auth()
  let boardPost = null
  let boardLoadError: string | null = null

  try {
    boardPost = await getBoardPost()
  } catch {
    boardLoadError = "Board data could not be loaded right now."
  }

  return <Board session={session} boardPost={boardPost} boardLoadError={boardLoadError} />
}
