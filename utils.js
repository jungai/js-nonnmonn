// Regex
export const dropPattern = /(^\<\@\d{18}\>) is dropping \d cards!$/gm;
export const grabPattern = /(^\<\@\d{18}\>) took the \*\*.*\*\* card `.*`!/;
export const dailyPattern = /you earned a daily reward/;

// Time
export const grabDurationSeconds = 10 * 60 * 1000; // 10min
export const dropDurationSeconds = 10 * 60 * 3000; // 30min
export const dailyDurationSeconds = 10 * 60 * 144000; // 1day

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
