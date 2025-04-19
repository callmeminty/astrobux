
/**
 * Generates a random alphanumeric captcha code
 * @param length Length of the captcha code (default: 8)
 * @returns Random alphanumeric string
 */
export function generateCaptcha(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Verifies if the user input matches the captcha
 * @param captcha The original captcha code
 * @param userInput The user's input
 * @returns Boolean indicating if the captcha is correct
 */
export function verifyCaptcha(captcha: string, userInput: string): boolean {
  return captcha.toLowerCase() === userInput.toLowerCase();
}

/**
 * Calculates points based on captcha difficulty and solve time
 * @param captchaLength Length of the solved captcha
 * @param timeInSeconds Time taken to solve in seconds
 * @returns Points earned
 */
export function calculatePoints(captchaLength: number, timeInSeconds: number): number {
  // Base points for solving any captcha
  const basePoints = 10;
  
  // Bonus points for longer captchas
  const lengthBonus = Math.max(0, captchaLength - 6) * 2;
  
  // Speed bonus (if solved quickly)
  const expectedTime = captchaLength * 1.5; // 1.5 seconds per character expected
  const timeBonus = Math.max(0, Math.floor((expectedTime - timeInSeconds) / 2)) * 2;
  
  return basePoints + lengthBonus + timeBonus;
}
