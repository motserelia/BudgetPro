"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../www/voice/voice-core.js");
global.BudgetPROVoiceCore = Core;
const Numbers = require("../www/voice/voice-number-normalizer.js");

const CASES = {
  ru: [
    ["пять", "5"], ["двадцать пять", "25"], ["сто двадцать три", "123"],
    ["ноль", "0"], ["десять", "10"], ["одиннадцать", "11"],
    ["девятнадцать", "19"], ["сорок два", "42"], ["девяносто девять", "99"],
    ["двести один", "201"], ["пятьсот пятьдесят пять", "555"],
    ["девятьсот девяносто девять", "999"], ["тысяча", "1000"],
    ["две тысячи триста", "2300"], ["номер один два три четыре", "номер 1234"],
    ["код ноль один два", "код 012"], ["один два три четыре пять", "12345"],
    ["двадцать пять процентов", "25%"], ["в шестнадцать тридцать", "в 16:30"],
    ["У меня двадцать пять задач", "У меня 25 задач"],
    ["Проверить задачу номер двадцать пять", "Проверить задачу номер 25"],
    ["Сделать пять лендингов", "Сделать 5 лендингов"],
  ],
  en: [
    ["five", "5"], ["twenty five", "25"], ["one hundred twenty three", "123"],
    ["zero", "0"], ["ten", "10"], ["eleven", "11"], ["nineteen", "19"],
    ["forty two", "42"], ["ninety nine", "99"], ["two hundred one", "201"],
    ["five hundred fifty five", "555"], ["nine hundred ninety nine", "999"],
    ["one thousand", "1000"], ["two thousand three hundred", "2300"],
    ["number one two three four", "number 1234"], ["code oh one two", "code 012"],
    ["one two three four five", "12345"], ["twenty five percent", "25%"],
    ["at sixteen thirty", "at 16:30"], ["I have twenty five tasks", "I have 25 tasks"],
    ["Task number twenty five", "Task number 25"], ["Make five landing pages", "Make 5 landing pages"],
  ],
  ka: [
    ["ხუთი", "5"], ["ოცდახუთი", "25"], ["ას ოცდასამი", "123"],
    ["ნული", "0"], ["ათი", "10"], ["თერთმეტი", "11"], ["ცხრამეტი", "19"],
    ["ორმოცდაორი", "42"], ["ოთხმოცდაათი ცხრა", "99"], ["ორასი ერთი", "201"],
    ["ხუთასი ორმოცდახუთი", "545"], ["ცხრაასი ოთხმოცდაათი ცხრა", "999"],
    ["ათასი", "1000"], ["ორი ათასი სამასი", "2300"],
    ["ნომერი ერთი ორი სამი ოთხი", "ნომერი 1234"],
    ["კოდი ნული ერთი ორი", "კოდი 012"],
    ["ერთი ორი სამი ოთხი ხუთი", "12345"], ["ოცდახუთი პროცენტი", "25%"],
    ["საათზე თექვსმეტი ოცდაათი", "საათზე 16:30"],
    ["მე მაქვს ოცდახუთი დავალება", "მე მაქვს 25 დავალება"],
    ["ხვალ სამი შეხვედრა მაქვს", "ხვალ 3 შეხვედრა მაქვს"],
    ["ეს არის ერთი ტესტი", "ეს არის 1 ტესტი"],
  ],
};

for (const [language, cases] of Object.entries(CASES)) {
  test(`normalizes at least 20 ${language.toUpperCase()} number cases`, () => {
    assert.ok(cases.length >= 20);
    for (const [input, expected] of cases) {
      assert.equal(Numbers.normalizeNumbers(input, language), expected, input);
    }
  });
}

test("keeps non-number Georgian Unicode unchanged", () => {
  for (const phrase of [
    "დღეს ახალი დავალება დავამატო",
    "ხვალ შეხვედრა მაქვს",
    "ეს არის ტესტი",
  ]) {
    assert.equal(Numbers.normalizeNumbers(phrase, "ka"), phrase);
  }
});
