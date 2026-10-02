(function (root, factory) {
  const api = factory(root.BudgetPROVoiceCore);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.BudgetPROVoiceNumberNormalizer = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core) {
  "use strict";

  const COMMON = Object.freeze({
    ru: {
      values: {
        ноль: 0, нуль: 0, один: 1, одна: 1, одно: 1, два: 2, две: 2, три: 3,
        четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8, девять: 9,
        десять: 10, одиннадцать: 11, двенадцать: 12, тринадцать: 13,
        четырнадцать: 14, пятнадцать: 15, шестнадцать: 16, семнадцать: 17,
        восемнадцать: 18, девятнадцать: 19, двадцать: 20, тридцать: 30,
        сорок: 40, пятьдесят: 50, шестьдесят: 60, семьдесят: 70,
        восемьдесят: 80, девяносто: 90,
      },
      hundreds: { сто: 100, двести: 200, триста: 300, четыреста: 400, пятьсот: 500, шестьсот: 600, семьсот: 700, восемьсот: 800, девятьсот: 900 },
      thousands: new Set(["тысяча", "тысячи", "тысяч"]),
      digitMarkers: new Set(["номер", "код", "id", "айди"]),
      percent: new Set(["процент", "процента", "процентов"]),
      timeMarkers: new Set(["в", "время"]),
    },
    en: {
      values: {
        zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
        seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
        thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
        eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
        fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
      },
      hundreds: { hundred: 100 },
      thousands: new Set(["thousand"]),
      digitMarkers: new Set(["number", "code", "id"]),
      percent: new Set(["percent", "percentage"]),
      timeMarkers: new Set(["at", "time"]),
      joiners: new Set(["and"]),
    },
    ka: {
      values: {
        ნული: 0, ერთი: 1, ორი: 2, სამი: 3, ოთხი: 4, ხუთი: 5, ექვსი: 6,
        შვიდი: 7, რვა: 8, ცხრა: 9, ათი: 10, თერთმეტი: 11, თორმეტი: 12,
        ცამეტი: 13, თოთხმეტი: 14, თხუთმეტი: 15, თექვსმეტი: 16,
        ჩვიდმეტი: 17, თვრამეტი: 18, ცხრამეტი: 19, ოცი: 20,
        ოცდაერთი: 21, ოცდაორი: 22, ოცდასამი: 23, ოცდაოთხი: 24,
        ოცდახუთი: 25, ოცდაექვსი: 26, ოცდაშვიდი: 27, ოცდარვა: 28,
        ოცდაცხრა: 29, ოცდაათი: 30, ოცდათერთმეტი: 31, ოცდათორმეტი: 32,
        ოცდაცამეტი: 33, ოცდათოთხმეტი: 34, ოცდათხუთმეტი: 35,
        ოცდათექვსმეტი: 36, ოცდაჩვიდმეტი: 37, ოცდათვრამეტი: 38,
        ოცდაცხრამეტი: 39, ორმოცი: 40, ორმოცდაერთი: 41,
        ორმოცდაორი: 42, ორმოცდასამი: 43, ორმოცდაოთხი: 44,
        ორმოცდახუთი: 45, ორმოცდაექვსი: 46, ორმოცდაშვიდი: 47,
        ორმოცდარვა: 48, ორმოცდაცხრა: 49, ორმოცდაათი: 50,
        ორმოცდათერთმეტი: 51, ორმოცდათორმეტი: 52, ორმოცდაცამეტი: 53,
        ორმოცდათოთხმეტი: 54, ორმოცდათხუთმეტი: 55, ორმოცდათექვსმეტი: 56,
        ორმოცდაჩვიდმეტი: 57, ორმოცდათვრამეტი: 58, ორმოცდაცხრამეტი: 59,
        სამოცი: 60, სამოცდაერთი: 61, სამოცდაორი: 62, სამოცდასამი: 63,
        სამოცდაოთხი: 64, სამოცდახუთი: 65, სამოცდაექვსი: 66,
        სამოცდაშვიდი: 67, სამოცდარვა: 68, სამოცდაცხრა: 69,
        სამოცდაათი: 70, სამოცდათერთმეტი: 71, სამოცდათორმეტი: 72,
        სამოცდაცამეტი: 73, სამოცდათოთხმეტი: 74, სამოცდათხუთმეტი: 75,
        სამოცდათექვსმეტი: 76, სამოცდაჩვიდმეტი: 77, სამოცდათვრამეტი: 78,
        სამოცდაცხრამეტი: 79, ოთხმოცი: 80, ოთხმოცდაერთი: 81,
        ოთხმოცდაორი: 82, ოთხმოცდასამი: 83, ოთხმოცდაოთხი: 84,
        ოთხმოცდახუთი: 85, ოთხმოცდაექვსი: 86, ოთხმოცდაშვიდი: 87,
        ოთხმოცდარვა: 88, ოთხმოცდაცხრა: 89, ოთხმოცდაათი: 90,
        ოთხმოცდათერთმეტი: 91, ოთხმოცდათორმეტი: 92, ოთხმოცდაცამეტი: 93,
        ოთხმოცდათოთხმეტი: 94, ოთხმოცდათხუთმეტი: 95,
        ოთხმოცდათექვსმეტი: 96, ოთხმოცდაჩვიდმეტი: 97,
        ოთხმოცდათვრამეტი: 98, ოთხმოცდაცხრამეტი: 99,
      },
      hundreds: { ას: 100, ასი: 100, ორასი: 200, სამასი: 300, ოთხასი: 400, ხუთასი: 500, ექვსასი: 600, შვიდასი: 700, რვაასი: 800, ცხრაასი: 900 },
      thousands: new Set(["ათასი"]),
      digitMarkers: new Set(["ნომერი", "კოდი", "აიდი"]),
      percent: new Set(["პროცენტი", "პროცენტია", "პროცენტით"]),
      timeMarkers: new Set(["საათზე", "დრო"]),
    },
  });

  function tokenize(text) {
    return String(text || "").normalize("NFC").match(/[\p{L}]+|\d+(?:[.,]\d+)?|[^\p{L}\p{N}\s]+/gu) || [];
  }

  function isWord(token) {
    return /^[\p{L}]+$/u.test(token);
  }

  function classify(word, config) {
    if (Object.hasOwn(config.values, word)) {
      const value = config.values[word];
      return { type: value < 10 ? "unit" : value < 20 ? "teen" : "tens", value };
    }
    if (Object.hasOwn(config.hundreds, word)) return { type: "hundred", value: config.hundreds[word] };
    if (config.thousands.has(word)) return { type: "thousand", value: 1000 };
    if (config.joiners?.has(word)) return { type: "joiner", value: 0 };
    return null;
  }

  function parseNumberWords(words, config, forceDigits) {
    const meaningful = words.map((word) => classify(word, config)).filter((item) => item?.type !== "joiner");
    if (!meaningful.length) return null;
    const allUnits = meaningful.every((item) => item.type === "unit");
    if (allUnits && (forceDigits || meaningful.length >= 3)) {
      return meaningful.map((item) => item.value).join("");
    }

    let total = 0;
    let current = 0;
    let previousType = "";
    for (const item of meaningful) {
      if (item.type === "unit" || item.type === "teen" || item.type === "tens") {
        if ((previousType === "teen" || previousType === "unit") && item.type !== "unit") return null;
        if (previousType === "tens" && item.type === "tens") return null;
        current += item.value;
      } else if (item.type === "hundred") {
        if (item.value === 100 && current > 0 && current < 10) current *= 100;
        else current += item.value;
      } else if (item.type === "thousand") {
        total += Math.max(1, current) * 1000;
        current = 0;
      }
      previousType = item.type;
    }
    return String(total + current);
  }

  function formatTokens(tokens) {
    let output = "";
    for (const token of tokens) {
      const noSpaceBefore = /^[,.;:!?%)}\]]$/u.test(token);
      const noSpaceAfterPrevious = /[(\[{]$/u.test(output);
      if (output && !noSpaceBefore && !noSpaceAfterPrevious) output += " ";
      output += token;
    }
    return output.replace(/\s+([,.;:!?%])/gu, "$1").replace(/\s+/gu, " ").trim();
  }

  function normalizeNumbers(text, language = "auto") {
    const lang = Core?.normalizeLanguage ? Core.normalizeLanguage(language) : String(language || "auto");
    const config = COMMON[lang];
    const normalized = Core?.normalizeTranscript ? Core.normalizeTranscript(text) : String(text || "").trim();
    if (!config) return normalized;
    const tokens = tokenize(normalized);
    const output = [];

    for (let index = 0; index < tokens.length;) {
      const lower = tokens[index].toLocaleLowerCase(lang === "ka" ? "ka-GE" : lang);
      const item = classify(lower, config);
      if (!item) {
        output.push(tokens[index++]);
        continue;
      }

      let end = index;
      const words = [];
      while (end < tokens.length) {
        const candidate = tokens[end].toLocaleLowerCase(lang === "ka" ? "ka-GE" : lang);
        if (!isWord(tokens[end]) || !classify(candidate, config)) break;
        words.push(candidate);
        end++;
      }
      const previous = output.length ? output[output.length - 1].toLocaleLowerCase() : "";
      const forceDigits = config.digitMarkers.has(previous);
      let parsed = parseNumberWords(words, config, forceDigits);

      if (parsed === null && words.length > 1) {
        const first = parseNumberWords([words[0]], config, forceDigits);
        const second = parseNumberWords(words.slice(1), config, false);
        const timeContext = config.timeMarkers.has(previous);
        if (timeContext && first !== null && second !== null && +first <= 23 && +second <= 59) {
          parsed = `${first}:${String(second).padStart(2, "0")}`;
        } else {
          output.push(first ?? tokens[index]);
          index++;
          continue;
        }
      }

      output.push(parsed ?? tokens[index]);
      index = parsed === null ? index + 1 : end;
      if (index < tokens.length && config.percent.has(tokens[index].toLocaleLowerCase())) {
        output.push("%");
        index++;
      }
    }
    return formatTokens(output);
  }

  return { normalizeNumbers, tokenize };
});
