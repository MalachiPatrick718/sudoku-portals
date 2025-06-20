// src/utils/scoring.js

export function calculateScore({ 
  isCorrect, 
  isPortal, 
  timeElapsed, 
  usedHint = false, 
  mistake = false,
  consecutiveCorrect = 0,
  isGameComplete = false
}) {
  if (usedHint) return -20;
  if (mistake && isPortal) return -30;
  if (mistake) return -10;

  let basePoints = 0;

  if (timeElapsed < 180) basePoints = 15;
  else if (timeElapsed < 360) basePoints = 10;
  else if (timeElapsed < 600) basePoints = 6;
  else basePoints = 3;

  if (isPortal) basePoints += 10;

  // Reward streaks
  if (consecutiveCorrect >= 3) basePoints += 5;
  if (consecutiveCorrect >= 5) basePoints += 10;

  // Bonus for completing the game
  if (isGameComplete) basePoints += 100;

  return basePoints;
}