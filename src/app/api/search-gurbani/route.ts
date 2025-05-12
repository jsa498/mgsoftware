import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.sikhitothemax.org/search?q=${encodeURIComponent(q)}`, {
      headers: { 'Accept': 'application/json' }
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream API error' }, { status: response.status })
    }
    const data = await response.json()
    // Forward the results array directly
    return NextResponse.json(data.results)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch remote data' }, { status: 502 })
  }
} 