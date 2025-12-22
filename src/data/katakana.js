const katakanaData = [
  // แถว A
  { character: 'ア', romaji: 'a' }, { character: 'イ', romaji: 'i' }, { character: 'ウ', romaji: 'u' }, { character: 'エ', romaji: 'e' }, { character: 'オ', romaji: 'o' },
  // แถว KA
  { character: 'カ', romaji: 'ka' }, { character: 'キ', romaji: 'ki' }, { character: 'ク', romaji: 'ku' }, { character: 'ケ', romaji: 'ke' }, { character: 'コ', romaji: 'ko' },
  // แถว SA
  { character: 'サ', romaji: 'sa' }, { character: 'シ', romaji: 'shi' }, { character: 'ス', romaji: 'su' }, { character: 'セ', romaji: 'se' }, { character: 'ソ', romaji: 'so' },
  // แถว TA
  { character: 'タ', romaji: 'ta' }, { character: 'チ', romaji: 'chi' }, { character: 'ツ', romaji: 'tsu' }, { character: 'テ', romaji: 'te' }, { character: 'ト', romaji: 'to' },
  // แถว NA
  { character: 'ナ', romaji: 'na' }, { character: 'ニ', romaji: 'ni' }, { character: 'ヌ', romaji: 'nu' }, { character: 'ネ', romaji: 'ne' }, { character: 'ノ', romaji: 'no' },
  // แถว HA
  { character: 'ハ', romaji: 'ha' }, { character: 'ヒ', romaji: 'hi' }, { character: 'フ', romaji: 'fu' }, { character: 'ヘ', romaji: 'he' }, { character: 'ホ', romaji: 'ho' },
  // แถว MA
  { character: 'マ', romaji: 'ma' }, { character: 'ミ', romaji: 'mi' }, { character: 'ム', romaji: 'mu' }, { character: 'メ', romaji: 'me' }, { character: 'モ', romaji: 'mo' },
  
  // --- แถว YA (จัดระเบียบ: Ya - ว่าง - Yu - ว่าง - Yo) ---
  { character: 'ヤ', romaji: 'ya' }, { character: '', romaji: '' }, { character: 'ユ', romaji: 'yu' }, { character: '', romaji: '' }, { character: 'ヨ', romaji: 'yo' },
  
  // แถว RA
  { character: 'ラ', romaji: 'ra' }, { character: 'リ', romaji: 'ri' }, { character: 'ル', romaji: 'ru' }, { character: 'レ', romaji: 're' }, { character: 'ロ', romaji: 'ro' },
  
  // --- แถว WA (จัดระเบียบ: Wa - ว่าง - ว่าง - ว่าง - Wo) ---
  { character: 'ワ', romaji: 'wa' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: 'ヲ', romaji: 'wo' },
  
  // --- แถว N (ตัวเดียว) ---
  { character: 'ン', romaji: 'n' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }
];

export { katakanaData };
export default katakanaData;