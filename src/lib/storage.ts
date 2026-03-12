export interface Assessment {
  id: string;
  userId: string;
  date: string;
  readingSpeed: number;
  timeTaken: number;
  wpmRatio: number;
  rhymeAccuracy: number;
  reactionTime: number;
  reversalCount: number;
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High";
}

export function getAgeNorm(age: number): number {
  if (age <= 10) return 85;
  if (age <= 13) return 140;
  return 200;
}

export function calculateRisk(
  readingSpeed: number,
  ageNorm: number,
  rhymeAccuracy: number,
  reversalCount: number
): { score: number; level: "Low" | "Moderate" | "High" } {
  let risk = 0;
  const speedRatio = readingSpeed / ageNorm;

  if (speedRatio < 0.6) risk += 40;
  else if (speedRatio < 0.8) risk += 25;
  else if (speedRatio < 1.0) risk += 10;

  if (rhymeAccuracy < 50) risk += 35;
  else if (rhymeAccuracy < 70) risk += 20;
  else if (rhymeAccuracy < 85) risk += 10;

  risk += Math.min(reversalCount * 5, 25);

  const level = risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low";
  return { score: risk, level };
}

export function saveAssessment(assessment: Assessment) {
  const all = getAssessments();
  all.push(assessment);
  localStorage.setItem("learnable_assessments", JSON.stringify(all));
}

export function getAssessments(): Assessment[] {
  try {
    return JSON.parse(localStorage.getItem("learnable_assessments") || "[]");
  } catch {
    return [];
  }
}

export function getUserAssessments(userId: string): Assessment[] {
  return getAssessments().filter((a) => a.userId === userId);
}

export const READING_PASSAGE =
  "The quick brown fox jumps over the lazy dog. Reading is an important skill that helps us learn about the world. Some people find reading easier than others, and that's okay. Everyone learns at their own pace. With practice and support, reading can become more enjoyable. Books open up new worlds and ideas. Whether you read fast or slow, what matters is understanding and enjoying what you read. Remember, every great reader started as a beginner.";

export const WORD_COUNT = 69;

export const RHYME_PAIRS: { word1: string; word2: string; rhymes: boolean }[] = [
  { word1: "cat", word2: "bat", rhymes: true },
  { word1: "dog", word2: "log", rhymes: true },
  { word1: "sun", word2: "fun", rhymes: true },
  { word1: "car", word2: "bus", rhymes: false },
  { word1: "fish", word2: "dish", rhymes: true },
  { word1: "tree", word2: "bee", rhymes: true },
  { word1: "pen", word2: "ten", rhymes: true },
  { word1: "dog", word2: "cat", rhymes: false },
  { word1: "moon", word2: "spoon", rhymes: true },
  { word1: "book", word2: "look", rhymes: true },
];
