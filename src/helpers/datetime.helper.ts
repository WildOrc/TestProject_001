export function getDatestamp (date: Date = new Date()) {
  return Math.floor(+date/100);
}