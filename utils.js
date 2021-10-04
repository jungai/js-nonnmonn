// Regex
export const dropPattern = /(^\<\@\d{18}\>) is dropping \d cards!$/gm;
export const grabPattern = /(^\<\@\d{18}\>) took the \*\*.*\*\* card `.*`!/;
export const dailyPattern = /you earned a daily reward/;
export const purchasePattern =
  /(^\<\@\d{18}\>), please follow this link to complete your purchase/;

// Time
export const grabDurationSeconds = 10 * 60 * 1000; // 10min
export const dropDurationSeconds = 10 * 60 * 3000; // 30min
export const dailyDurationSeconds = 84600000; // 23.5hr
export const oneMinuteDurationSeconds = 60000; // 1min
export const oneHourDurationSeconds = 3600000; // 1hour

// Env
function getEnv(key) {
  const val = process.env[key];

  if (val) {
    return val;
  }

  throw new Error(`${key} is required !!`);
}

export function getToken() {
  return getEnv("TOKEN");
}

export function getClientId() {
  return getEnv("clientId");
}

export function getGuildId() {
  return getEnv("guildId");
}

// Fn
export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function getUserFromPattern(text) {
  return text.split(" ")[0];
}
