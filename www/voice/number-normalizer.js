(function(root, factory) { const api = factory(); if (typeof module === 'object') module.exports = api; root.BudgetPROVoiceNumberNormalizer = api; })(globalThis, () => {
  'use strict';
  const enSmall = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  const ruSmall = 'ноль один два три четыре пять шесть семь восемь девять десять одиннадцать двенадцать тринадцать четырнадцать пятнадцать шестнадцать семнадцать восемнадцать девятнадцать'.split(' ');
  const kaSmall = 'ნული ერთი ორი სამი ოთხი ხუთი ექვსი შვიდი რვა ცხრა ათი თერთმეტი თორმეტი ცამეტი თოთხმეტი თხუთმეტი თექვსმეტი ჩვიდმეტი თვრამეტი ცხრამეტი'.split(' ');
  const dict = words => Object.fromEntries(words.map((w, i) => [w, i]));
  const values = { en: dict(enSmall), ru: dict(ruSmall), ka: dict(kaSmall) };
  Object.assign(values.en, { oh: 0, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 });
  Object.assign(values.ru, { нуль: 0, одна: 1, одно: 1, две: 2, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50, шестьдесят: 60, семьдесят: 70, восемьдесят: 80, девяносто: 90, сто: 100, двести: 200, триста: 300, четыреста: 400, пятьсот: 500, шестьсот: 600, семьсот: 700, восемьсот: 800, девятьсот: 900 });
  // Georgian is vigesimal: base + და + remainder (1..19). Hundreds use
  // a final ი in isolation and the stem before another number: ორასი / ორას.
  const kaBases = { ოცი: 20, ორმოცი: 40, სამოცი: 60, ოთხმოცი: 80 };
  Object.assign(values.ka, kaBases);
  for (const [base, n] of Object.entries(kaBases)) {
    values.ka[base.slice(0, -1) + 'და'] = n;
    for (let r = 1; r < 20; r++) values.ka[base.slice(0, -1) + 'და' + kaSmall[r]] = n + r;
  }
  ['ასი', 'ორასი', 'სამასი', 'ოთხასი', 'ხუთასი', 'ექვსასი', 'შვიდასი', 'რვაასი', 'ცხრაასი'].forEach((w, i) => { values.ka[w] = (i + 1) * 100; values.ka[w.slice(0, -1)] = (i + 1) * 100; });
  // Vosk appends the nominative ი to compound numerals (ოცდაცხრაი instead of
  // ოცდაცხრა). Only a known numeral stem may lose the ending, so normal words
  // are never reinterpreted as numbers.
  const lookup = (lang, w) => {
    const table = values[lang];
    if (!table) return undefined;
    if (table[w] !== undefined) return table[w];
    if (lang === 'ka' && w.length > 2 && w.endsWith('ი')) return table[w.slice(0, -1)];
    return undefined;
  };
  const scales = { en: { hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 }, ru: { тысяча: 1000, тысячи: 1000, тысяч: 1000, миллион: 1000000, миллиона: 1000000, миллионов: 1000000, миллиард: 1000000000, миллиарда: 1000000000, миллиардов: 1000000000 }, ka: { ათასი: 1000, ათას: 1000, მილიონი: 1000000, მილიონ: 1000000, მილიარდი: 1000000000, მილიარდ: 1000000000 } };
  const markers = /^(number|code|phone|id|номер|код|телефон|ნომერი|კოდი|ტელეფონი)$/u;
  const decimal = { en: /^(point|dot)$/, ru: /^(запятая|точка)$/, ka: /^(მძიმე|წერტილი)$/ };
  function parse(words, lang, digitContext = false) {
    const nums = words.map(w => lookup(lang, w));
    if (nums.every(n => n !== undefined && n < 10) && (digitContext || nums.length >= 3)) return nums.join('');
    let total = 0, group = 0, previous = null, additive = false;
    for (const w of words) {
      if (w === 'and' && lang === 'en') continue;
      // Georgian vigesimal compounds may be dictated as "base + და + remainder"
      // (ორმოცი და ათი = 50, ორმოცი და ოცი = 60): the explicit conjunction
      // marks an additive step, never a second independent amount.
      if (w === 'და' && lang === 'ka') { additive = true; continue; }
      const scale = scales[lang][w];
      if (scale) { if (scale === 100) group = (group || 1) * scale; else { total += (group || 1) * scale; group = 0; } previous = null; additive = false; continue; }
      const n = lookup(lang, w);
      if (n === undefined) return null;
      if (previous !== null && previous < 20 && n >= 10 && n < 100) return null;
      if (!additive && previous !== null && previous >= 20 && previous < 100 && n >= 20 && n < 100) return null;
      if (previous !== null && previous < 10 && n < 10) return null;
      group += n; previous = n; additive = false;
    }
    return String(total + group);
  }
  function normalizeNumbers(text, language = 'auto') {
    const langs = language === 'auto' ? ['ka', 'ru', 'en'] : [String(language).split('-')[0]];
    let result = String(text || '').normalize('NFC').trim();
    for (const lang of langs) {
      if (!values[lang]) continue;
      // Keep original punctuation and whitespace outside the number spans.
      const tokens = [...result.matchAll(/[\p{L}]+(?:-[\p{L}]+)*|\d+(?:[.,]\d+)?/gu)];
      let output = '', cursor = 0;
      for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i][0].toLowerCase();
        const numberWord = w => lookup(lang, w) !== undefined || scales[lang][w] !== undefined;
        if (!numberWord(word.split('-')[0])) continue;
        let j = i, words = [];
        while (j < tokens.length) {
          const parts = tokens[j][0].toLowerCase().split('-');
          // A standalone Georgian "და" folds a vigesimal base and its remainder
          // (ორმოცი და ათი = 50) only when an adjacent number word follows it.
          if (lang === 'ka' && parts.length === 1 && parts[0] === 'და') {
            const next = tokens[j + 1];
            if (j === i || !next || !next[0].toLowerCase().split('-').every(w => numberWord(w))) break;
            if (!/^\s+$/.test(result.slice(tokens[j - 1].index + tokens[j - 1][0].length, tokens[j].index))) break;
            if (!/^\s+$/.test(result.slice(tokens[j].index + tokens[j][0].length, next.index))) break;
            words.push('და'); j++; continue;
          }
          if (!parts.every(w => numberWord(w) || (w === 'and' && lang === 'en'))) break;
          if (j > i && !/^\s+$/.test(result.slice(tokens[j - 1].index + tokens[j - 1][0].length, tokens[j].index))) break;
          words.push(...parts); j++;
        }
        while (words.at(-1) === 'and') { words.pop(); j--; }
        const previous = tokens[i - 1]?.[0].toLowerCase() || '';
        let parsed = parse(words, lang, markers.test(previous));
        if (parsed === null && /^(at|time|в|время|საათზე|დრო)$/.test(previous) && words.length === 2) {
          const a = values[lang][words[0]], b = values[lang][words[1]];
          if (a <= 23 && b <= 59) parsed = `${a}:${String(b).padStart(2, '0')}`;
        }
        if (parsed === null) { j = i + 1; parsed = parse(word.split('-'), lang); }
        if (parsed === null) continue;
        if (decimal[lang].test(tokens[j]?.[0].toLowerCase() || '')) {
          let k = j + 1, digits = '';
          while (k < tokens.length && values[lang][tokens[k][0].toLowerCase()] < 10) digits += values[lang][tokens[k++][0].toLowerCase()];
          if (digits) { parsed += '.' + digits; j = k; }
        }
        const end = tokens[j - 1].index + tokens[j - 1][0].length;
        output += result.slice(cursor, tokens[i].index) + parsed; cursor = end; i = j - 1;
      }
      result = output + result.slice(cursor);
    }
    if (/^\d(?:\s+\d){2,}$/.test(result)) result = result.replace(/\s+/g, '');
    result = result.replace(/(?<![\p{L}])(number|code|phone|id|номер|код|телефон|ნომერი|კოდი|ტელეფონი)\s+(\d(?:\s+\d)+)(?=\s*(?:$|[^\d\s]))/giu, (_, marker, digits) => marker + ' ' + digits.replace(/\s+/g, ''));
    return result.replace(/(\d)\s+(percent|процент(?:а|ов)?|პროცენტი)(?=\s|$|[.!?,])/giu, '$1%');
  }
  // Cloud keyterms are derived from this table so the recognizer and the parser
  // never drift apart. Vigecimal stems (ოცდა, ორმოცდა...) are prefixes, not
  // dictated words, so they are excluded.
  const keytermWords = lang => {
    const table = values[lang];
    if (!table) return [];
    const words = new Set(Object.keys(table).concat(Object.keys(scales[lang] || {})));
    return [...words].filter(w => w.length >= 3 && w !== 'and' && !/და$/u.test(w)).sort();
  };
  return { normalizeNumbers, parse, keytermWords };
});
