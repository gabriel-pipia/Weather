export const formatTemp = (celsius: number, isFahrenheit: boolean): number => {
  return Math.round(isFahrenheit ? (celsius * 9) / 5 + 32 : celsius);
};

export const formatSpeed = (ms: number, isMph: boolean): number => {
  // from meters/sec to km/h or mph
  return Math.round(isMph ? ms * 2.23694 : ms * 3.6);
};
