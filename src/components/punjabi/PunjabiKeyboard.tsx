"use client";

import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';

export interface PunjabiKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const PunjabiKeyboard: React.FC<PunjabiKeyboardProps> = ({ onKeyPress, onBackspace, onClear }) => {
  const layout = {
    default: [
      'ੳ ੲ ਅ ਸ ਹ',
      'ਕ ਖ ਗ ਘ ਙ',
      'ਚ ਛ ਜ ਝ ਞ',
      'ਟ ਠ ਡ ਢ ਣ',
      'ਤ ਥ ਦ ਧ ਨ',
      'ਪ ਫ ਬ ਭ ਮ',
      'ਯ ਰ ਲ ਵ ਸ਼ ਸ ਹ',
      '{bksp} {space} {clear}'
    ]
  };

  const display = {
    '{bksp}': '⌫',
    '{space}': 'Space',
    '{clear}': 'Clear'
  };

  const handleKeyPress = (button: string) => {
    if (button === '{bksp}') {
      onBackspace();
    } else if (button === '{clear}') {
      onClear();
    } else if (button === '{space}') {
      onKeyPress(' ');
    } else {
      onKeyPress(button);
    }
  };

  return (
    <div className="mx-auto">
      <Keyboard
        layout={layout}
        display={display}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default PunjabiKeyboard; 