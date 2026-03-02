const georgianMap: Record<string, string> = {
  'ა': 'a',
  'ბ': 'b',
  'გ': 'g',
  'დ': 'd',
  'ე': 'e',
  'ვ': 'v',
  'ზ': 'z',
  'თ': 't',
  'ი': 'i',
  'კ': 'k',
  'ლ': 'l',
  'მ': 'm',
  'ნ': 'n',
  'ო': 'o',
  'პ': 'p',
  'ჟ': 'zh',
  'რ': 'r',
  'ს': 's',
  'ტ': 't',
  'უ': 'u',
  'ფ': 'p',
  'ქ': 'k',
  'ღ': 'gh',
  'ყ': 'q',
  'შ': 'sh',
  'ჩ': 'ch',
  'ც': 'ts',
  'ძ': 'dz',
  'წ': 'ts',
  'ჭ': 'ch',
  'ხ': 'kh',
  'ჯ': 'j',
  'ჰ': 'h',
};

/**
 * Transliterates Georgian characters to English (Latin) characters.
 * Useful for querying APIs that might only support English city names.
 */
export function transliterateGeorgian(text: string): string {
  if (!text) return '';
  
  return text
    .split('')
    .map(char => {
      const lowerChar = char.toLowerCase();
      const mapped = georgianMap[lowerChar];
      
      if (mapped) {
        // Handle case sensitivity if necessary, although Georgian doesn't have casing in common use (Mkhedruli)
        // But if we want to preserve input case for non-mapped characters:
        return mapped;
      }
      return char;
    })
    .join('');
}
