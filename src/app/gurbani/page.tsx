"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PunjabiKeyboard from '@/components/punjabi/PunjabiKeyboard';

export default function GurbaniPage() {
  const [searchText, setSearchText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(true);

  const appendCharacter = (char: string) => {
    setSearchText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setSearchText((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setSearchText('');
  };

  const handleSearch = (text: string) => {
    // TODO: implement search logic
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Gurbani</h1>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Type in Gurmukhi or use the on-screen keyboard..."
          />
          <Button onClick={() => setKeyboardVisible((v) => !v)} variant="outline">
            {keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'}
          </Button>
        </div>
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
    </div>
  );
} 