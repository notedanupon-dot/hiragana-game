const hiraganaData = [
  // แถว A
  { character: 'あ', romaji: 'a' }, { character: 'い', romaji: 'i' }, { character: 'う', romaji: 'u' }, { character: 'え', romaji: 'e' }, { character: 'お', romaji: 'o' },
  // แถว KA
  { character: 'か', romaji: 'ka' }, { character: 'き', romaji: 'ki' }, { character: 'く', romaji: 'ku' }, { character: 'け', romaji: 'ke' }, { character: 'こ', romaji: 'ko' },
  // แถว SA
  { character: 'さ', romaji: 'sa' }, { character: 'し', romaji: 'shi' }, { character: 'す', romaji: 'su' }, { character: 'せ', romaji: 'se' }, { character: 'そ', romaji: 'so' },
  // แถว TA
  { character: 'た', romaji: 'ta' }, { character: 'ち', romaji: 'chi' }, { character: 'つ', romaji: 'tsu' }, { character: 'て', romaji: 'te' }, { character: 'と', romaji: 'to' },
  // แถว NA
  { character: 'な', romaji: 'na' }, { character: 'に', romaji: 'ni' }, { character: 'ぬ', romaji: 'nu' }, { character: 'ね', romaji: 'ne' }, { character: 'の', romaji: 'no' },
  // แถว HA
  { character: 'は', romaji: 'ha' }, { character: 'ひ', romaji: 'hi' }, { character: 'ふ', romaji: 'fu' }, { character: 'へ', romaji: 'he' }, { character: 'ほ', romaji: 'ho' },
  // แถว MA
  { character: 'ま', romaji: 'ma' }, { character: 'み', romaji: 'mi' }, { character: 'む', romaji: 'mu' }, { character: 'め', romaji: 'me' }, { character: 'も', romaji: 'mo' },
  
  // --- แถว YA (จัดระเบียบ: Ya - ว่าง - Yu - ว่าง - Yo) ---
  { character: 'や', romaji: 'ya' }, { character: '', romaji: '' }, { character: 'ゆ', romaji: 'yu' }, { character: '', romaji: '' }, { character: 'よ', romaji: 'yo' },
  
  // แถว RA
  { character: 'ら', romaji: 'ra' }, { character: 'り', romaji: 'ri' }, { character: 'る', romaji: 'ru' }, { character: 'れ', romaji: 're' }, { character: 'ろ', romaji: 'ro' },
  
  // --- แถว WA (จัดระเบียบ: Wa - ว่าง - ว่าง - ว่าง - Wo) ---
  { character: 'わ', romaji: 'wa' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: 'を', romaji: 'wo' },
  
  // --- แถว N (ตัวเดียว) ---
  { character: 'ん', romaji: 'n' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }, { character: '', romaji: '' }
];

export { hiraganaData };
export default hiraganaData;