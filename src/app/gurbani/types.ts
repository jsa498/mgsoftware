export interface SearchHit {
  id?: string;
  shabadid?: string;
  gurmukhi?: { unicode: string };
  firstletters?: { unicode: string };
}

export interface ShabadInfo {
  shabadid: string;
  pageno: number;
  source: {
    id: number;
    akhar: string;
    unicode: string;
    english: string;
    length: number;
    pageName: {
      akhar: string;
      unicode: string;
      english: string;
    };
  };
  writer: {
    id: number;
    akhar: string;
    unicode: string;
    english: string;
  };
  raag: {
    id: number;
    akhar: string;
    unicode: string;
    english: string;
    startang: number;
    endang: number;
    raagwithpage: string;
  };
  count?: number;
}

export interface ShabadLine {
  line: {
    id: string;
    type: number;
    gurmukhi: {
      akhar: string;
      unicode: string;
    };
    larivaar?: {
      akhar: string;
      unicode: string;
    };
    translation?: {
      english?: { default: string };
      punjabi?: { default: { akhar: string; unicode: string } };
      spanish?: string;
    };
    transliteration?: {
      english?: { text: string; larivaar?: string };
      devanagari?: { text: string; larivaar?: string };
    };
    linenum?: number;
    firstletters?: { akhar: string; unicode: string };
  };
}

export interface ShabadResponse {
  shabadinfo: ShabadInfo;
  shabad: ShabadLine[];
  error?: boolean;
} 