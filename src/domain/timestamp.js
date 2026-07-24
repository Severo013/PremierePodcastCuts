const HOURS_TIMESTAMP_PATTERN = /^(\d+):([0-5]\d):([0-5]\d)(?:\.(\d{3}))?$/;
const MINUTES_TIMESTAMP_PATTERN = /^([0-5]\d):([0-5]\d)(?:\.(\d{3}))?$/;

function millisecondsToSeconds(value) {
  return value ? Number(value) / 1000 : 0;
}

function finiteSeconds(value) {
  return Number.isFinite(value) ? value : null;
}

function parseTimestamp(value) {
  if (typeof value !== "string") {
    return null;
  }

  const hoursMatch = HOURS_TIMESTAMP_PATTERN.exec(value);
  if (hoursMatch) {
    const [, hours, minutes, seconds, milliseconds] = hoursMatch;
    return finiteSeconds(
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(seconds) +
      millisecondsToSeconds(milliseconds)
    );
  }

  const minutesMatch = MINUTES_TIMESTAMP_PATTERN.exec(value);
  if (minutesMatch) {
    const [, minutes, seconds, milliseconds] = minutesMatch;
    return finiteSeconds(
      Number(minutes) * 60 +
      Number(seconds) +
      millisecondsToSeconds(milliseconds)
    );
  }

  return null;
}

module.exports = { parseTimestamp };
