import { auth } from "@/lib/auth"
import { getBoardFeed } from "@/lib/board"

import { Board } from "@/app/components/board"

export default async function Home() {
  const session = await auth()
  let boardFeed = null
  let boardLoadError: string | null = null

  try {
    boardFeed = await getBoardFeed()
  } catch {
    boardLoadError = "Board data could not be loaded right now."
  }

  return <Board session={session} boardFeed={boardFeed} boardLoadError={boardLoadError} />
}
