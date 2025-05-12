export interface GurbaniSearchResult {
  shabad_id: string;
  shabad_name: string;
  page_no: string;
  gurmukhi: string;
  translation: string;
  transliteration: string;
}

export async function searchGurbani(query: string): Promise<GurbaniSearchResult[]> {
  try {
    const response = await fetch(`/api/search-gurbani?q=${encodeURIComponent(query)}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Gurbani search results');
    }

    const data = await response.json();
    return data.map((result: GurbaniSearchResult) => ({
      shabad_id: result.shabad_id,
      shabad_name: result.shabad_name,
      page_no: result.page_no,
      gurmukhi: result.gurmukhi,
      translation: result.translation,
      transliteration: result.transliteration,
    }));
  } catch (error) {
    console.error('Error searching Gurbani:', error);
    throw error;
  }
} 