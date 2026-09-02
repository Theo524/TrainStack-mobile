export const motivationalQuotes = [
  "Discipline beats motivation.",
  "Small progress still counts.",
  "Train today. Thank yourself later.",
  "You do not need perfect. You need consistent.",
  "Strong habits build strong bodies.",
  "One session can change your mood.",
  "Show up first. Motivation can follow.",
  "Do the simple things well.",
  "Your future self is watching.",
  "Stack the work. Trust the process.",
  "Energy comes after you start.",
  "Win the day one set at a time.",
  "You are building proof, not just plans.",
  "Make it too easy to quit? Never.",
  "Effort compounds.",
];

export function getDailyMotivationalQuote() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayNumber = Math.floor((today - startOfYear) / 86400000);

  return motivationalQuotes[dayNumber % motivationalQuotes.length];
}