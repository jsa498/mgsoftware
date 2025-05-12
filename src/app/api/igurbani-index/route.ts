import { NextResponse } from 'next/server'
import { load } from 'cheerio'

export async function GET() {
  const res = await fetch('https://www.igurbani.com/index')
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch iGurbani index' }, { status: 502 })
  }
  const html = await res.text()
  const $ = load(html)
  const data: Array<{ id: string; raagKey: string; pageRef: string }> = []

  // Locate the first table under 'Sri Guru Granth Sahib' section
  const table = $('table').first()
  table.find('tr').each((index: number, row: any) => {
    if (index === 0) return // skip header row
    const cols = $(row).find('td')
    const id = $(cols[0]).text().trim()
    const raagKey = $(cols[1]).text().trim()
    const pageRef = $(cols[2]).text().trim()
    if (id && raagKey && pageRef) {
      data.push({ id, raagKey, pageRef })
    }
  })

  return NextResponse.json(data)
} 