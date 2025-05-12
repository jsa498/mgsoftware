"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PunjabiKeyboard from '@/components/punjabi/PunjabiKeyboard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SearchHit, ShabadResponse, ShabadLine } from './types';

export default function GurbaniPage() {
  const [searchText, setSearchText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(true);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShabadId, setSelectedShabadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shabadData, setShabadData] = useState<ShabadResponse | null>(null);
  const [shabadLoading, setShabadLoading] = useState(false);
  const [shabadError, setShabadError] = useState<string | null>(null);

  const appendCharacter = (char: string) => {
    setSearchText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setSearchText((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setSearchText('');
  };

  const handleSearch = async (text: string): Promise<void> => {
    setSearchText(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `https://api.gurbaninow.com/v2/search/${encodeURIComponent(text)}?searchtype=1`;
      console.log('Fetching Gurbani search:', apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      const responseJson = await response.json() as { shabads: Array<{ shabad: SearchHit }> };
      console.log('Gurbani search response:', responseJson);
      const hits = responseJson.shabads.map(({ shabad }) => shabad);
      setResults(hits);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedShabadId) return;
    const fetchShabad = async () => {
      setShabadLoading(true);
      setShabadError(null);
      try {
        const resp = await fetch(`https://api.gurbaninow.com/v2/shabad/${encodeURIComponent(selectedShabadId)}`);
        if (!resp.ok) throw new Error(`Network response was not ok: ${resp.status}`);
        const data = await resp.json() as ShabadResponse;
        setShabadData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setShabadError(err.message);
        } else {
          setShabadError(String(err));
        }
      } finally {
        setShabadLoading(false);
      }
    };
    fetchShabad();
  }, [selectedShabadId]);

  const openShabad = (id: string) => {
    setSelectedShabadId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShabadId(null);
    setShabadData(null);
    setShabadError(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Gurbani</h1>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchText);
              }
            }}
            placeholder="Type in Gurmukhi or use the on-screen keyboard..."
          />
          <Button onClick={() => handleSearch(searchText)}>
            Search
          </Button>
          <Button onClick={() => setKeyboardVisible((v) => !v)} variant="outline">
            {keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'}
          </Button>
        </div>
        {/* Search Results */}
        {loading && <div className="mt-4">Loading...</div>}
        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
        {/* No Results Message */}
        {!loading && !error && results.length === 0 && searchText.trim() && (
          <div className="mt-4 text-gray-500">No results found.</div>
        )}
        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((item: SearchHit, index: number) => (
              <Card
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-800"
                onClick={() => openShabad((item.shabadid || item.id)!)}
              >
                <div className="text-base">
                  {item.gurmukhi?.unicode || item.firstletters?.unicode || JSON.stringify(item)}
                </div>
              </Card>
            ))}
          </div>
        )}
        {keyboardVisible && (
          <div className="mt-4">
            <PunjabiKeyboard
              onKeyPress={appendCharacter}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />
          </div>
        )}
      </Card>
      {/* Shabad Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-h-[80vh] w-full sm:max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {shabadData ?
                `${shabadData.shabadinfo.writer.unicode} in ${shabadData.shabadinfo.raag.unicode} - ${shabadData.shabadinfo.pageno}`
                : `Shabad ${selectedShabadId}`
              }
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {shabadLoading && <div>Loading shabad...</div>}
            {shabadError && <div className="text-red-500">Error: {shabadError}</div>}
            {shabadData && (
              <div className="max-h-[80vh] w-full sm:max-w-2xl overflow-hidden">
                <div className="overflow-y-auto p-4 space-y-4 max-h-[80vh]">
                  {/* Metadata Section */}
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-400">
                      Ang {shabadData.shabadinfo.pageno} – {shabadData.shabadinfo.source.pageName.unicode} ({shabadData.shabadinfo.source.pageName.english})
                    </p>
                    <p className="text-sm text-gray-400">
                      Writer: {shabadData.shabadinfo.writer.unicode} ({shabadData.shabadinfo.writer.english})
                    </p>
                    <p className="text-sm text-gray-400">
                      Raag: {shabadData.shabadinfo.raag.unicode} ({shabadData.shabadinfo.raag.english})
                    </p>
                  </div>
                  {/* Lines Section */}
                  {(shabadData.shabad || []).map((entry: ShabadLine, idx: number) => {
                    const unicodeLine = entry.line.gurmukhi.unicode;
                    return (
                      <p key={idx} className="text-2xl leading-tight border-b border-gray-700 pb-2">
                        {unicodeLine}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 