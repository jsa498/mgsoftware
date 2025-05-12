export interface IgurbaniIndexEntry {
  id: string
  raagKey: string
  pageRef: string
}

export async function fetchIgurbaniIndex(): Promise<IgurbaniIndexEntry[]> {
  const res = await fetch('/api/igurbani-index')
  if (!res.ok) {
    throw new Error('Failed to load iGurbani index')
  }
  return res.json()
} 